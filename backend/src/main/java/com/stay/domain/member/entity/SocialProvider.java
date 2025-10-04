package com.stay.domain.member.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * 소셜 로그인 제공자 Enum
 *
 * - GOOGLE: 구글 로그인
 * - NAVER: 네이버 로그인
 * - KAKAO: 카카오 로그인
 */
@Getter
@RequiredArgsConstructor
public enum SocialProvider {

    GOOGLE("구글", "google"),
    NAVER("네이버", "naver"),
    KAKAO("카카오", "kakao");

    private final String displayName;
    private final String providerKey;  // OAuth 콜백에서 사용되는 키

    /**
     * providerKey로 SocialProvider 찾기
     *
     * @param key OAuth 콜백에서 전달된 provider 키 (예: "google", "naver")
     * @return 해당하는 SocialProvider
     * @throws IllegalArgumentException 지원하지 않는 제공자일 경우
     */
    public static SocialProvider fromKey(String key) {
        if (key == null || key.trim().isEmpty()) {
            throw new IllegalArgumentException("소셜 제공자 키는 필수입니다.");
        }

        String normalizedKey = key.toLowerCase().trim();

        for (SocialProvider provider : values()) {
            if (provider.providerKey.equals(normalizedKey)) {
                return provider;
            }
        }

        throw new IllegalArgumentException("지원하지 않는 소셜 제공자입니다: " + key);
    }

    /**
     * 해당 제공자가 지원되는지 확인
     *
     * @param key 확인할 제공자 키
     * @return 지원 여부
     */
    public static boolean isSupported(String key) {
        try {
            fromKey(key);
            return true;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }
}