package com.stay.config.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * Spring Security 설정
 *
 * 역할:
 * - 어떤 URL은 인증 없이 접근 가능한지 설정
 * - 어떤 URL은 로그인이 필요한지 설정
 * - JWT 필터를 Security 필터 체인에 등록
 * - CORS 설정
 *
 * 왜 이렇게 설정하는가?
 * - REST API이므로 세션 사용 안 함 (Stateless)
 * - JWT 토큰 기반 인증 사용
 * - 프론트엔드와 백엔드가 다른 포트에서 실행 (CORS 필요)
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // CSRF 비활성화 (REST API에서는 불필요)
                .csrf(csrf -> csrf.disable())

                // CORS 설정 적용
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // 세션 사용 안 함 (JWT 사용)
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // URL별 접근 권한 설정
                .authorizeHttpRequests(auth -> auth
                        // 인증 없이 접근 가능한 URL (Public)
                        .requestMatchers(
                                "/api/auth/**", // 로그인, OAuth 등
                                "/api/test/**",
                                "api/members/check-nickname", // 테스트 API
                                "/api/email-verification/**", // 이메일 인증 API
                                "/health",
                                "/error"
                        ).permitAll()

                        // 관리자만 접근 가능
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        // 그 외 모든 요청은 인증 필요
                        .anyRequest().authenticated()
                )
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

    /**
     * CORS 설정
     *
     * 왜 필요한가?
     * - 프론트엔드(http://localhost:5173)와 백엔드(http://localhost:8080)가 다른 포트
     * - 브라우저의 Same-Origin Policy 때문에 CORS 설정 필요
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // 허용할 출처 (프론트엔드 URL)
        configuration.setAllowedOrigins(List.of(
                "http://localhost:5173",
                "http://localhost:3000"  // React 기본 포트도 추가
        ));

        // 허용할 HTTP 메서드
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));

        // 허용할 헤더
        configuration.setAllowedHeaders(List.of("*"));

        // 인증 정보 포함 허용 (쿠키, Authorization 헤더 등)
        configuration.setAllowCredentials(true);

        // Preflight 요청 캐시 시간 (초)
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}