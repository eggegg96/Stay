package com.stay.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.client.WebClient;

/**
 * WebClient 설정
 *
 * 왜 필요한가?
 * - 외부 API 호출용 (OAuth 제공자)
 * - RestTemplate의 최신 대안
 * - 비동기/동기 모두 지원
 *
 * RestTemplate vs WebClient:
 * - RestTemplate: 옛날 방식, Blocking I/O
 * - WebClient: 최신 방식, Non-blocking I/O (성능 우수)
 */
@Configuration
public class WebClientConfig {

    /**
     * 기본 WebClient 빈 등록
     *
     * 설정:
     * - Content-Type: application/json
     * - Accept: application/json
     * - 타임아웃 등 추가 설정 가능
     */
    @Bean
    public WebClient webClient() {
        return WebClient.builder()
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .defaultHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                .build();
    }
}