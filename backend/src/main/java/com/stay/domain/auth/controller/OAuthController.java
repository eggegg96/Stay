package com.stay.domain.auth.controller;

import com.stay.domain.auth.dto.JwtTokenResponse;
import com.stay.domain.auth.dto.OAuthLoginRequest;
import com.stay.domain.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * OAuth 인증 컨트롤러
 *
 * 역할:
 * - 프론트엔드로부터 OAuth 인증 코드를 받음
 * - AuthService에 위임해서 로그인 처리
 * - JWT 토큰을 응답으로 반환
 *
 * 왜 이렇게 간단한가?
 * - Controller는 HTTP 요청/응답만 처리 (얇은 계층)
 * - 실제 비즈니스 로직은 AuthService → OAuthService → MemberService로 이어짐
 * - 이게 바로 계층화 아키텍처의 장점!
 */
@Slf4j
@RestController
@RequestMapping("/api/auth/oauth")
@RequiredArgsConstructor
public class OAuthController {

    private final AuthService authService;

    /**
     * OAuth 로그인 엔드포인트
     *
     * 전체 흐름:
     * 1. [프론트] 사용자가 "구글 로그인" 버튼 클릭
     * 2. [프론트] 구글 로그인 페이지로 이동
     * 3. [구글] 사용자 인증 후 code 발급
     * 4. [프론트] code를 이 엔드포인트로 전송 ← 지금 여기!
     * 5. [백엔드] code로 구글에 액세스 토큰 요청
     * 6. [백엔드] 액세스 토큰으로 구글에 사용자 정보 요청
     * 7. [백엔드] 회원가입/로그인 처리
     * 8. [백엔드] JWT 토큰 발급
     * 9. [프론트] JWT 토큰 저장 후 로그인 완료
     *
     * @param request OAuth 로그인 요청 (provider, code)
     * @return JWT 토큰 (accessToken, refreshToken)
     */
    @PostMapping("/login")
    public ResponseEntity<?> oauthLogin(@RequestBody OAuthLoginRequest request) {
        try {
            log.info("========================================");
            log.info("OAuth 로그인 요청 시작");
            log.info("Provider: {}", request.provider());
            log.info("Code: {}...", request.code().substring(0, Math.min(20, request.code().length())));
            log.info("========================================");

            // AuthService에 OAuth 로그인 처리 위임
            // AuthService → OAuthService → 구글 API 호출 → MemberService → JWT 발급
            JwtTokenResponse response = authService.oauthLogin(request);

            log.info("========================================");
            log.info("OAuth 로그인 성공!");
            log.info("========================================");

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            // 잘못된 요청 (provider 오류, code 형식 오류 등)
            log.error("========================================");
            log.error("잘못된 OAuth 요청");
            log.error("에러: {}", e.getMessage());
            log.error("========================================");

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "error", "INVALID_REQUEST",
                            "message", e.getMessage()
                    ));

        } catch (IllegalStateException e) {
            // OAuth 처리 중 발생한 비즈니스 로직 에러
            // (토큰 발급 실패, 사용자 정보 조회 실패 등)
            log.error("========================================");
            log.error("OAuth 처리 실패");
            log.error("에러: {}", e.getMessage(), e);
            log.error("========================================");

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                            "error", "OAUTH_FAILED",
                            "message", e.getMessage()
                    ));

        } catch (Exception e) {
            // 예상치 못한 서버 내부 오류
            log.error("========================================");
            log.error("OAuth 로그인 중 예상치 못한 오류 발생");
            log.error("에러: {}", e.getMessage(), e);
            log.error("========================================");

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "error", "SERVER_ERROR",
                            "message", "OAuth 로그인 처리 중 오류가 발생했습니다.",
                            "detail", e.getMessage()  // 개발 중에만 사용, 운영에서는 제거 권장
                    ));
        }
    }
}