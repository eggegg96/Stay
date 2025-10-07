package com.stay.domain.auth.dto;

import lombok.Builder;

/**
 * JWT 토큰 응답 DTO
 *
 * 왜 필요한가?
 * - 로그인 성공 시 프론트엔드에게 토큰을 전달하기 위해
 * - Record를 사용해서 불변 객체로 만듦 (실수로 변경 방지)
 *
 * 프론트엔드는 이 응답을 받아서:
 * - accessToken을 localStorage에 저장
 * - API 요청 시 Header에 "Bearer {accessToken}" 형태로 전달
 * - refreshToken도 저장해서 액세스 토큰 갱신에 사용
 */
@Builder
public record JwtTokenResponse(
        String accessToken,
        String refreshToken,
        String tokenType,      // "Bearer"
        Long expiresIn         // 액세스 토큰 만료 시간 (초 단위)
) {
    /**
     * 편의 생성 메서드
     * Bearer 타입으로 고정하고, 만료 시간을 자동 계산
     */
    public static JwtTokenResponse of(String accessToken, String refreshToken, Long accessTokenValidity) {
        return JwtTokenResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(accessTokenValidity / 1000)  // 밀리초 -> 초 변환
                .build();
    }
}