package com.stay.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * JWT 설정 정보
 * application-dev.yml의 jwt.* 설정을 읽어옴
 */
@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "jwt")
public class JwtProperties {

    /**
     * JWT 서명에 사용할 비밀키
     * HS256 알고리즘 기준 최소 256비트(32바이트) 필요
     */
    private String secret;

    /**
     * Access Token 유효기간 (밀리초)
     * 기본값: 1시간 (3600000ms)
     */
    private Long accessTokenValidity;

    /**
     * Refresh Token 유효기간 (밀리초)
     * 기본값: 7일 (604800000ms)
     */
    private Long refreshTokenValidity;
}