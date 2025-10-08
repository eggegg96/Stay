package com.stay.domain.auth.dto;

/**
 * 네이버 사용자 정보 (실제 데이터)
 */
public record NaverUserInfo(
        String id,
        String email,
        String name,
        String profile_image
) {}