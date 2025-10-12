package com.stay.config.security;

import com.stay.domain.auth.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

/**
 * JWT 인증 필터
 *
 * 역할:
 * - 모든 HTTP 요청에서 Authorization 헤더의 JWT 토큰 검증
 * - 유효한 토큰이면 Spring Security 인증 정보 등록
 * - 인증된 사용자 정보를 SecurityContext에 저장
 *
 * 왜 OncePerRequestFilter를 상속하는가?
 * - 요청당 한 번만 실행되도록 보장
 * - 비동기 요청에서도 정상 동작
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        try {
            // 1. Authorization 헤더에서 토큰 추출
            String token = extractToken(request);

            // 2. 토큰이 있고 유효한지 검증
            if (token != null && jwtUtil.validateToken(token)) {

                // 3. 토큰에서 사용자 정보 추출
                Long memberId = jwtUtil.getMemberIdFromToken(token);
                String email = jwtUtil.getEmailFromToken(token);

                // 4. Spring Security 인증 객체 생성
                // 권한은 일단 ROLE_USER로 설정 (나중에 DB에서 가져오도록 개선 가능)
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                memberId,  // principal (주체)
                                null,      // credentials (비밀번호, JWT에서는 불필요)
                                List.of(new SimpleGrantedAuthority("ROLE_USER"))  // 권한
                        );

                // 5. SecurityContext에 인증 정보 저장
                // 이후 컨트롤러에서 @AuthenticationPrincipal로 사용자 정보 접근 가능
                SecurityContextHolder.getContext().setAuthentication(authentication);

                log.debug("JWT 인증 성공 - memberId: {}, email: {}", memberId, email);
            }

        } catch (Exception e) {
            log.error("JWT 인증 실패", e);
            // 인증 실패해도 요청은 계속 진행 (SecurityConfig에서 처리)
        }

        // 6. 다음 필터로 진행
        filterChain.doFilter(request, response);
    }

    /**
     * Authorization 헤더에서 Bearer 토큰 추출
     *
     * 형식: "Authorization: Bearer eyJhbGciOiJIUzUxMiJ9..."
     */
    private String extractToken(HttpServletRequest request) {
        // 쿠키에서 accessToken 추출
        Cookie[] cookies = request.getCookies();

        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("accessToken".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }

        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);  // "Bearer " 이후 문자열 반환
        }

        return null;
    }
}