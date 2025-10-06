package com.stay.domain.member.dto;

import com.stay.domain.member.entity.SocialProvider;

/**
 * 소셜 로그인 요청 DTO
 *
 * 실무 포인트:
 * - Record로 불변성 보장 (간결함)
 * - 파라미터 6개 → 1개 객체로 가독성 향상
 * - Compact Constructor로 최소한의 검증
 */
public record SocialLoginRequest(
        SocialProvider provider,
        String socialId,
        String email,
        String name,
        String socialEmail,
        String profileImageUrl
) {

    /**
     * Compact Constructor
     *
     * 실무 관점:
     * - null 체크 정도만 (과도한 validation은 Service에서)
     * - trim으로 공백 제거
     */
    public SocialLoginRequest {
        if (provider == null || socialId == null || email == null || name == null) {
            throw new IllegalArgumentException("필수 값이 누락되었습니다.");
        }

        // 간단한 데이터 정규화
        socialId = socialId.trim();
        email = email.trim().toLowerCase();
        name = name.trim();

        if (socialEmail != null) {
            socialEmail = socialEmail.trim().toLowerCase();
        }

        if (profileImageUrl != null) {
            profileImageUrl = profileImageUrl.trim();
        }
    }
}