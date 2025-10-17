package com.stay.domain.auth.controller;

import com.stay.domain.auth.dto.JwtTokenResponse;
import com.stay.domain.auth.dto.OAuthLoginRequest;
import com.stay.domain.auth.service.AuthService;
import com.stay.domain.auth.util.JwtUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * OAuth 컨트롤러 (HttpOnly 쿠키 방식)
 *
 * 주요 기능:
 * 1. OAuth 로그인 (POST /api/auth/oauth/login)
 *    - 신규 회원: 회원가입 필요 (isNewMember=true, 쿠키 X)
 *    - 기존 회원: JWT 토큰을 HttpOnly 쿠키로 발급
 *
 * 2. 로그아웃 (POST /api/auth/oauth/logout)
 *    - HttpOnly 쿠키 삭제
 *
 * 3. Access Token 갱신 (POST /api/auth/refresh)
 *    - Refresh Token으로 새 Access Token 발급
 *    - 프론트엔드가 401 에러 받으면 자동 호출
 *
 * HttpOnly 쿠키의 장점:
 * - XSS 공격 방어: JavaScript로 토큰 접근 불가
 * - 자동 전송: 브라우저가 쿠키를 자동으로 관리
 * - 프론트엔드 간소화: 토큰 관리 코드 불필요
 */
@Slf4j
@RestController
@RequestMapping("/api/auth/oauth")
@RequiredArgsConstructor
public class OAuthController {

    private final AuthService authService;
    private final JwtUtil jwtUtil;

    /**
     * OAuth 로그인 엔드포인트 (HttpOnly 쿠키 방식)
     *
     * 흐름:
     * 1. 프론트엔드가 소셜 제공자에서 받은 code 전달
     * 2. 백엔드가 code로 사용자 정보 조회
     * 3. 신규 회원: 회원가입 필요 (isNewMember=true 반환, 쿠키 X)
     * 4. 기존 회원: JWT 토큰을 HttpOnly 쿠키로 발급
     *
     * 왜 HttpOnly로 바꾸나?
     * - localStorage는 JavaScript로 접근 가능 → XSS 공격에 취약
     * - HttpOnly 쿠키는 JavaScript 접근 차단 → 보안 강화
     *
     * @param request OAuth 로그인 요청 (provider, code)
     * @param response HttpServletResponse (쿠키 설정용)
     * @return 로그인 결과 (신규 회원 여부, 이메일)
     */
    @PostMapping("/login")
    public ResponseEntity<?> oauthLogin(
            @RequestBody OAuthLoginRequest request,
            HttpServletResponse response
    ) {
        try {
            log.info("========================================");
            log.info("OAuth 로그인 요청 시작");
            log.info("Provider: {}", request.provider());
            log.info("Code: {}...", request.code().substring(0, Math.min(20, request.code().length())));
            log.info("========================================");

            // AuthService에 OAuth 로그인 처리 위임
            JwtTokenResponse tokenResponse = authService.oauthLogin(request);

            // 신규 회원이 아닌 경우에만 쿠키 설정
            if (!tokenResponse.isNewMember()) {
                // Access Token을 HttpOnly 쿠키로 설정
                Cookie accessTokenCookie = new Cookie("accessToken", tokenResponse.accessToken());
                accessTokenCookie.setHttpOnly(true);  // JavaScript 접근 차단
                accessTokenCookie.setSecure(false);   // 개발 환경 (배포 시 true)
                accessTokenCookie.setPath("/");       // 모든 경로에서 쿠키 전송
                accessTokenCookie.setMaxAge(7 * 24 * 60 * 60); // 7일
                response.addCookie(accessTokenCookie);

                // Refresh Token을 HttpOnly 쿠키로 설정
                Cookie refreshTokenCookie = new Cookie("refreshToken", tokenResponse.refreshToken());
                refreshTokenCookie.setHttpOnly(true);
                refreshTokenCookie.setSecure(false);
                refreshTokenCookie.setPath("/");
                refreshTokenCookie.setMaxAge(30 * 24 * 60 * 60); // 30일
                response.addCookie(refreshTokenCookie);

                log.info("기존 회원 로그인 - HttpOnly 쿠키로 토큰 발급");
            } else {
                log.info("신규 회원 가입 필요 - 쿠키 발급하지 않음");
            }

            log.info("========================================");

            // 프론트엔드에 신규 회원 여부 전달
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "로그인 성공",
                    "isNewMember", tokenResponse.isNewMember(),
                    "email", tokenResponse.email()
            ));

        } catch (IllegalArgumentException e) {
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
            log.error("========================================");
            log.error("OAuth 로그인 중 예상치 못한 오류 발생");
            log.error("에러: {}", e.getMessage(), e);
            log.error("========================================");

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "error", "SERVER_ERROR",
                            "message", "OAuth 로그인 처리 중 오류가 발생했습니다.",
                            "detail", e.getMessage()
                    ));
        }
    }

    /**
     * 로그아웃 API
     *
     * HttpOnly 쿠키 삭제:
     * - Access Token 쿠키 삭제
     * - Refresh Token 쿠키 삭제
     *
     * @param response HttpServletResponse (쿠키 삭제용)
     * @return 로그아웃 성공 메시지
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        log.info("로그아웃 요청");

        // Access Token 쿠키 삭제 (MaxAge를 0으로 설정)
        Cookie accessTokenCookie = new Cookie("accessToken", null);
        accessTokenCookie.setHttpOnly(true);
        accessTokenCookie.setSecure(false);
        accessTokenCookie.setPath("/");
        accessTokenCookie.setMaxAge(0);  // 즉시 삭제
        response.addCookie(accessTokenCookie);

        // Refresh Token 쿠키 삭제
        Cookie refreshTokenCookie = new Cookie("refreshToken", null);
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setSecure(false);
        refreshTokenCookie.setPath("/");
        refreshTokenCookie.setMaxAge(0);
        response.addCookie(refreshTokenCookie);

        log.info("로그아웃 성공 - 쿠키 삭제 완료");

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "로그아웃 성공"
        ));
    }

    /**
     * Access Token 갱신 API
     *
     * 흐름:
     * 1. 쿠키에서 Refresh Token 추출
     * 2. Refresh Token 검증
     * 3. 유효하면 새로운 Access Token 발급
     * 4. 새 Access Token을 쿠키로 설정
     *
     * 왜 필요한가?
     * - Access Token은 짧은 유효기간 (7일)
     * - Refresh Token은 긴 유효기간 (30일)
     * - Access Token 만료 시 자동으로 갱신
     * - 프론트엔드가 401 에러를 받으면 이 API를 호출
     *
     * 실무 팁:
     * - 실제 서비스에서는 Access Token을 더 짧게 (15분~1시간)
     * - Refresh Token도 DB에 저장해서 관리
     * - Refresh Token도 만료되면 다시 로그인 필요
     *
     * @param request HttpServletRequest (쿠키 읽기용)
     * @param response HttpServletResponse (쿠키 설정용)
     * @return 갱신 결과
     */
    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        try {
            log.info("Access Token 갱신 요청");

            // 1. 쿠키에서 Refresh Token 추출
            String refreshToken = extractRefreshToken(request);

            if (refreshToken == null) {
                log.warn("Refresh Token이 없습니다.");
                throw new IllegalStateException("Refresh Token이 없습니다. 다시 로그인해주세요.");
            }

            // 2. Refresh Token 검증
            if (!jwtUtil.validateToken(refreshToken)) {
                log.warn("유효하지 않은 Refresh Token");
                throw new IllegalStateException("유효하지 않은 Refresh Token입니다. 다시 로그인해주세요.");
            }

            // 3. Refresh Token에서 사용자 정보 추출
            Long memberId = jwtUtil.getMemberIdFromToken(refreshToken);
            String email = jwtUtil.getEmailFromToken(refreshToken);

            // 4. 새로운 Access Token 발급
            String newAccessToken = jwtUtil.generateAccessToken(memberId, email);

            // 5. 새 Access Token을 쿠키로 설정
            Cookie accessTokenCookie = new Cookie("accessToken", newAccessToken);
            accessTokenCookie.setHttpOnly(true);
            accessTokenCookie.setSecure(false);
            accessTokenCookie.setPath("/");
            accessTokenCookie.setMaxAge(7 * 24 * 60 * 60); // 7일
            response.addCookie(accessTokenCookie);

            log.info("Access Token 갱신 성공 - memberId: {}", memberId);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "토큰 갱신 성공"
            ));

        } catch (IllegalStateException e) {
            log.error("토큰 갱신 실패: {}", e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "error", "REFRESH_FAILED",
                            "message", e.getMessage()
                    ));

        } catch (Exception e) {
            log.error("토큰 갱신 중 오류 발생", e);
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "error", "SERVER_ERROR",
                            "message", "토큰 갱신 중 오류가 발생했습니다."
                    ));
        }
    }

    /**
     * 쿠키에서 Refresh Token 추출 (Private 헬퍼 메서드)
     *
     * @param request HttpServletRequest
     * @return Refresh Token (없으면 null)
     */
    private String extractRefreshToken(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();

        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("refreshToken".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }

        return null;
    }
}