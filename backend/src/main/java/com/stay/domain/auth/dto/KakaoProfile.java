package com.stay.domain.auth.dto;

/**
 * 카카오 프로필 정보
 */
public record KakaoProfile(
        String nickname,
        String profile_image_url
) {}