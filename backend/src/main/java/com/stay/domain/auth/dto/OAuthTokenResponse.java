package com.stay.domain.auth.dto;

/**
 * OAuth 토큰 응답 DTO (소셜 제공자 → 백엔드)
 *
 * 구글, 네이버, 카카오에서 이런 형식으로 응답:
 * {
 *   "access_token": "ya29.a0AfH6...",
 *   "token_type": "Bearer",
 *   "expires_in": 3599
 * }
 */
public record OAuthTokenResponse(
        String access_token,
        String token_type,
        Integer expires_in
) {}