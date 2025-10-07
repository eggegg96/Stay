package com.stay.domain.auth.util;

import com.stay.config.JwtProperties;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SecurityException;
import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * JWT 토큰 생성 및 검증 유틸리티
 *
 * 왜 필요한가?
 * - 로그인 성공 시 사용자를 식별할 수 있는 토큰을 만들어야 함
 * - API 요청 시 토큰이 유효한지 검증해야 함
 *
 * JWT 구조:
 * Header.Payload.Signature
 * - Header: 토큰 타입, 알고리즘 정보
 * - Payload: 실제 데이터 (memberId, email 등)
 * - Signature: 위변조 방지용 서명
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class JwtUtil {

    private final JwtProperties jwtProperties;

    /**
     * JWT 서명에 사용할 비밀키 생성
     * HS256 알고리즘 사용
     */
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(
                jwtProperties.getSecret().getBytes(StandardCharsets.UTF_8)
        );
    }

    // ==================== Access Token ====================

    /**
     * Access Token 생성
     *
     * @param memberId 회원 ID
     * @param email 회원 이메일
     * @return JWT Access Token
     *
     * 왜 memberId와 email을 넣을까?
     * - memberId: DB 조회 시 사용 (성능)
     * - email: 사용자 식별용 (가독성)
     */
    public String generateAccessToken(Long memberId, String email) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtProperties.getAccessTokenValidity());

        return Jwts.builder()
                .subject(String.valueOf(memberId))           // 토큰 주체 (회원 ID)
                .claim("email", email)                       // 추가 정보 (이메일)
                .claim("type", "access")                     // 토큰 타입 구분
                .issuedAt(now)                               // 발급 시간
                .expiration(expiryDate)                      // 만료 시간
                .signWith(getSigningKey())                   // 서명
                .compact();
    }

    // ==================== Refresh Token ====================

    /**
     * Refresh Token 생성
     * Access Token보다 유효기간이 길고, 최소한의 정보만 포함
     *
     * @param memberId 회원 ID
     * @return JWT Refresh Token
     */
    public String generateRefreshToken(Long memberId) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtProperties.getRefreshTokenValidity());

        return Jwts.builder()
                .subject(String.valueOf(memberId))
                .claim("type", "refresh")
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(getSigningKey())
                .compact();
    }

    // ==================== 토큰 검증 ====================

    /**
     * 토큰에서 회원 ID 추출
     *
     * @param token JWT 토큰
     * @return 회원 ID
     * @throws JwtException 토큰이 유효하지 않은 경우
     */
    public Long getMemberIdFromToken(String token) {
        Claims claims = parseClaims(token);
        return Long.parseLong(claims.getSubject());
    }

    /**
     * 토큰에서 이메일 추출
     */
    public String getEmailFromToken(String token) {
        Claims claims = parseClaims(token);
        return claims.get("email", String.class);
    }

    /**
     * 토큰 유효성 검증
     *
     * @param token JWT 토큰
     * @return 유효하면 true, 아니면 false
     *
     * 검증 내용:
     * - 서명이 올바른가? (위변조 체크)
     * - 만료되지 않았는가?
     * - 형식이 올바른가?
     */
    public boolean validateToken(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (SecurityException | MalformedJwtException e) {
            log.error("잘못된 JWT 서명입니다.", e);
        } catch (ExpiredJwtException e) {
            log.error("만료된 JWT 토큰입니다.", e);
        } catch (UnsupportedJwtException e) {
            log.error("지원되지 않는 JWT 토큰입니다.", e);
        } catch (IllegalArgumentException e) {
            log.error("JWT 토큰이 잘못되었습니다.", e);
        }
        return false;
    }

    /**
     * 토큰 파싱 (내부 사용)
     * JWT를 해석해서 Payload(Claims)를 가져옴
     */
    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())  // 서명 검증
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /**
     * 토큰 타입 확인 (Access인지 Refresh인지)
     */
    public String getTokenType(String token) {
        Claims claims = parseClaims(token);
        return claims.get("type", String.class);
    }
}