package com.stay.domain.auth.dto;

/**
 * JWT 토큰 응답 DTO
 *
 * HttpOnly 쿠키 방식에서는:
 * - Controller에서만 사용 (토큰 추출용)
 * - 프론트엔드에는 success, message, isNewMember만 전달
 *
 * record를 사용하는 이유:
 * - 불변 객체 (final 필드 자동 생성)
 * - getter 자동 생성 (accessToken(), refreshToken() 등)
 * - equals(), hashCode(), toString() 자동 생성
 * - @Getter 어노테이션 불필요
 */
public record JwtTokenResponse(
        String accessToken,
        String refreshToken,
        String tokenType,
        Long expiresIn,
        boolean isNewMember,
        String email,
        String provider,
        String providerId,
        String name,
        String profileImageUrl
) {
    /**
     * 기존 회원용 생성 메서드
     * (토큰 포함, OAuth 정보 없음)
     */
    public static JwtTokenResponse of(
            String accessToken,
            String refreshToken,
            Long accessTokenValidity,
            boolean isNewMember,
            String email
    ) {
        return new JwtTokenResponse(
                accessToken,
                refreshToken,
                "Bearer",
                accessTokenValidity / 1000,  // 밀리초 -> 초 변환
                isNewMember,
                email,
                null,
                null,
                null,
                null
        );
    }

    /**
     * 신규 회원용 생성 메서드
     * (토큰 없음, OAuth 정보 포함)
     */
    public static JwtTokenResponse ofNewMember(
            String email,
            String provider,
            String providerId,
            String name,
            String profileImageUrl
    ) {
        return new JwtTokenResponse(
                null,  // 토큰 없음
                null,
                "Bearer",
                null,
                true,  // 신규 회원
                email,
                provider,
                providerId,
                name,
                profileImageUrl
        );
    }

    /**
     * 3개 파라미터 버전 (호환성 유지용)
     *
     * @Deprecated 기존 코드와의 호환성을 위해 남겨둠
     */
    @Deprecated
    public static JwtTokenResponse of(
            String accessToken,
            String refreshToken,
            Long accessTokenValidity
    ) {
        return new JwtTokenResponse(
                accessToken,
                refreshToken,
                "Bearer",
                accessTokenValidity / 1000,
                false,
                null,
                null,
                null,
                null,
                null
        );
    }
}