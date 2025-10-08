package com.stay.domain.auth.dto;

/**
 * OAuth 로그인 요청 DTO
 *
 * 프론트엔드에서 이렇게 전달:
 * POST /api/auth/oauth/login
 * {
 *   "provider": "GOOGLE",
 *   "code": "4/0AY0e-g7..."
 * }
 *
 * 왜 필요한가?
 * - 프론트엔드는 소셜 제공자에서 받은 code만 전달
 * - 백엔드가 code로 OAuth 처리
 */
public record OAuthLoginRequest(
        String provider,  // GOOGLE, NAVER, KAKAO
        String code       // OAuth authorization code
) {
    public OAuthLoginRequest {
        if (provider == null || provider.isBlank()) {
            throw new IllegalArgumentException("provider는 필수입니다.");
        }
        if (code == null || code.isBlank()) {
            throw new IllegalArgumentException("code는 필수입니다.");
        }
    }
}