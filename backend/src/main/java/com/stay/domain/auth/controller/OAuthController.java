// backend/src/main/java/com/stay/domain/auth/controller/OAuthController.java
package com.stay.domain.auth.controller;

import com.stay.domain.auth.dto.JwtTokenResponse;
import com.stay.domain.auth.dto.OAuthLoginRequest;
import com.stay.domain.auth.service.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/auth/oauth")
@RequiredArgsConstructor
public class OAuthController {

    private final AuthService authService;

    /**
     * OAuth 로그인 엔드포인트 (HttpOnly 쿠키 방식)
     *
     * 변경 사항:
     * - JWT 토큰을 HttpOnly 쿠키로 응답
     * - 프론트엔드는 토큰을 직접 저장하지 않음
     * - 브라우저가 자동으로 쿠키를 관리
     *
     * 왜 HttpOnly로 바꾸나?
     * - localStorage는 JavaScript로 접근 가능 → XSS 공격에 취약
     * - HttpOnly 쿠키는 JavaScript 접근 차단 → 보안 강화
     */
    @PostMapping("/login")
    public ResponseEntity<?> oauthLogin(
            @RequestBody OAuthLoginRequest request,
            HttpServletResponse response  // 쿠키 설정을 위해 추가
    ) {
        try {
            log.info("========================================");
            log.info("OAuth 로그인 요청 시작");
            log.info("Provider: {}", request.provider());
            log.info("Code: {}...", request.code().substring(0, Math.min(20, request.code().length())));
            log.info("========================================");

            // AuthService에 OAuth 로그인 처리 위임
            JwtTokenResponse tokenResponse = authService.oauthLogin(request);

            // Access Token을 HttpOnly 쿠키로 설정
            Cookie accessTokenCookie = new Cookie("accessToken", tokenResponse.accessToken());
            accessTokenCookie.setHttpOnly(true);  // JavaScript 접근 차단
            accessTokenCookie.setSecure(false);   // 개발 환경 (배포 시 true로 변경)
            accessTokenCookie.setPath("/");       // 모든 경로에서 쿠키 전송
            accessTokenCookie.setMaxAge(7 * 24 * 60 * 60); // 7일 (초 단위)
            response.addCookie(accessTokenCookie);

            // Refresh Token을 HttpOnly 쿠키로 설정
            Cookie refreshTokenCookie = new Cookie("refreshToken", tokenResponse.refreshToken());
            refreshTokenCookie.setHttpOnly(true);
            refreshTokenCookie.setSecure(false);
            refreshTokenCookie.setPath("/");
            refreshTokenCookie.setMaxAge(30 * 24 * 60 * 60); // 30일
            response.addCookie(refreshTokenCookie);

            log.info("========================================");
            log.info("OAuth 로그인 성공! HttpOnly 쿠키로 토큰 발급");
            log.info("========================================");

            // 프론트엔드에는 토큰 없이 성공 메시지만 응답
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "로그인 성공"
                    // 토큰은 쿠키에 있으므로 응답 본문에 포함하지 않음
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
    }/**
     * 로그아웃 API
     *
     * HttpOnly 쿠키 삭제
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
}