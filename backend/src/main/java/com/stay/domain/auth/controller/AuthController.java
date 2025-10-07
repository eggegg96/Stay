package com.stay.domain.auth.controller;

import com.stay.domain.auth.dto.JwtTokenResponse;
import com.stay.domain.auth.dto.TokenRefreshRequest;
import com.stay.domain.auth.service.AuthService;
import com.stay.domain.member.dto.SocialLoginRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * 인증 컨트롤러
 *
 * API 엔드포인트:
 * - POST /api/auth/login : 소셜 로그인
 * - POST /api/auth/refresh : Access Token 재발급
 *
 * 왜 필요한가?
 * - 프론트엔드가 백엔드에 인증 요청을 보낼 창구
 * - HTTP 요청/응답 처리
 * - 비즈니스 로직은 Service에 위임 (Controller는 얇게!)
 */
@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * 소셜 로그인 API
     *
     * POST /api/auth/login
     *
     * 요청 Body:
     * {
     *   "provider": "GOOGLE",
     *   "socialId": "google-123456",
     *   "email": "user@gmail.com",
     *   "name": "홍길동",
     *   "socialEmail": "user@gmail.com",
     *   "profileImageUrl": "https://..."
     * }
     *
     * 응답:
     * {
     *   "accessToken": "eyJhbGc...",
     *   "refreshToken": "eyJhbGc...",
     *   "tokenType": "Bearer",
     *   "expiresIn": 3600
     * }
     *
     * 프론트엔드는 이렇게 사용:
     * 1. 소셜 로그인 버튼 클릭
     * 2. OAuth 인증 완료 후 소셜 제공자에서 정보 받기
     * 3. 이 API로 정보 전달
     * 4. 받은 JWT 토큰을 localStorage에 저장
     * 5. 이후 API 호출 시 Header에 "Bearer {accessToken}" 추가
     */
    @PostMapping("/login")
    public ResponseEntity<JwtTokenResponse> login(
            @RequestBody SocialLoginRequest request
    ) {
        log.info("소셜 로그인 요청 - provider: {}, email: {}",
                request.provider(), request.email());

        try {
            JwtTokenResponse response = authService.socialLogin(request);

            log.info("소셜 로그인 성공 - email: {}", request.email());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("소셜 로그인 실패", e);

            // 에러 처리는 나중에 GlobalExceptionHandler로 통합 예정
            // 지금은 간단하게 500 에러 반환
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Access Token 재발급 API
     *
     * POST /api/auth/refresh
     *
     * 요청 Body:
     * {
     *   "refreshToken": "eyJhbGc..."
     * }
     *
     * 응답:
     * {
     *   "accessToken": "새로운토큰...",
     *   "refreshToken": "새로운리프레시토큰...",
     *   "tokenType": "Bearer",
     *   "expiresIn": 3600
     * }
     *
     * 언제 사용?
     * - 프론트엔드에서 API 요청 시 401 Unauthorized 받으면
     * - 저장된 Refresh Token으로 이 API 호출
     * - 새로운 Access Token 받아서 다시 요청
     */
    @PostMapping("/refresh")
    public ResponseEntity<JwtTokenResponse> refresh(
            @RequestBody TokenRefreshRequest request
    ) {
        log.info("토큰 재발급 요청");

        try {
            JwtTokenResponse response = authService.refreshAccessToken(request.refreshToken());

            log.info("토큰 재발급 성공");
            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            log.error("토큰 재발급 실패: {}", e.getMessage());
            return ResponseEntity.badRequest().build();

        } catch (Exception e) {
            log.error("토큰 재발급 실패", e);
            return ResponseEntity.internalServerError().build();
        }
    }
}