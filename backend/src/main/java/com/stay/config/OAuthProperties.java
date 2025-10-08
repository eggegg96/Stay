package com.stay.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

/**
 * OAuth 설정 정보
 *
 * 왜 필요한가?
 * - application-dev.yml의 oauth.* 설정을 읽어옴
 * - 소셜 제공자별 Client ID, Secret, URL 등을 관리
 * - 하드코딩 방지 (설정 파일로 분리)
 */
@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "oauth")
public class OAuthProperties {

    private Map<String, Provider> providers = new HashMap<>();

    // Spring Boot가 자동으로 setGoogle(), setNaver(), setKakao() 호출
    private Provider google;
    private Provider naver;
    private Provider kakao;

    /**
     * 특정 소셜 제공자의 설정 조회
     *
     * @param providerName 제공자 이름 (google, naver, kakao)
     * @return Provider 설정 객체
     */
    public Provider getProvider(String providerName) {
        Provider provider = switch (providerName.toLowerCase()) {
            case "google" -> google;
            case "naver" -> naver;
            case "kakao" -> kakao;
            default -> null;
        };

        if (provider == null) {
            throw new IllegalArgumentException("지원하지 않는 OAuth 제공자: " + providerName);
        }
        return provider;
    }

    /**
     * 소셜 제공자별 설정
     */
    @Getter
    @Setter
    public static class Provider {
        private String clientId;
        private String clientSecret;
        private String redirectUri;
        private String tokenUri;      // access_token 발급 URL
        private String userInfoUri;   // 사용자 정보 조회 URL
    }
}