package com.stay.domain.auth.dto;

/**
 * 카카오 계정 정보
 */
public record KakaoAccount(
        String email,
        KakaoProfile profile
) {}