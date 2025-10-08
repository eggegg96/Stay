package com.stay.domain.auth.service;

import com.stay.config.JwtProperties;
import com.stay.domain.auth.dto.JwtTokenResponse;
import com.stay.domain.auth.dto.OAuthLoginRequest;
import com.stay.domain.auth.util.JwtUtil;
import com.stay.domain.member.dto.SocialLoginRequest;
import com.stay.domain.member.entity.Member;
import com.stay.domain.member.service.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 인증 서비스
 *
 * 책임:
 * - OAuth 로그인 처리 (OAuthService에 위임)
 * - JWT 토큰 발급
 * - 토큰 재발급
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final MemberService memberService;
    private final OAuthService oauthService;
    private final JwtUtil jwtUtil;
    private final JwtProperties jwtProperties;

    /**
     * OAuth 로그인 처리 (백엔드에서 처리)
     *
     * 흐름:
     * 1. OAuthService로 code → 사용자 정보 조회
     * 2. MemberService로 회원 가입/로그인 처리
     * 3. JWT 토큰 발급
     *
     * @param request OAuth 로그인 요청 (provider, code)
     * @return JWT 토큰
     *
     * 왜 이렇게 분리했나?
     * - OAuthService: 외부 API 통신 (소셜 제공자)
     * - MemberService: 회원 도메인 로직 (DB 저장/조회)
     * - AuthService: 인증 비즈니스 로직 (JWT 발급)
     *
     * 각자의 역할이 명확해짐 (단일 책임 원칙!)
     */
    public JwtTokenResponse oauthLogin(OAuthLoginRequest request) {
        log.info("OAuth 로그인 처리 시작 - provider: {}", request.provider());

        // 1. OAuth 처리: code → 사용자 정보
        SocialLoginRequest socialLoginRequest = oauthService.processOAuthLogin(
                request.provider(),
                request.code()
        );

        // 2. 회원 가입 or 로그인
        Member member = memberService.socialLogin(socialLoginRequest);

        // 3. JWT 토큰 발급
        String accessToken = jwtUtil.generateAccessToken(member.getId(), member.getEmail());
        String refreshToken = jwtUtil.generateRefreshToken(member.getId());

        log.info("OAuth 로그인 완료 - memberId: {}, email: {}",
                member.getId(), member.getEmail());

        return JwtTokenResponse.of(
                accessToken,
                refreshToken,
                jwtProperties.getAccessTokenValidity()
        );
    }

    /**
     * 소셜 로그인 (기존 방식 - 프론트엔드에서 사용자 정보 전달)
     *
     * 호환성을 위해 남겨둠
     * 나중에 제거 예정
     */
    @Deprecated
    public JwtTokenResponse socialLogin(SocialLoginRequest request) {
        log.info("소셜 로그인 처리 시작 - provider: {}, email: {}",
                request.provider(), request.email());

        Member member = memberService.socialLogin(request);

        String accessToken = jwtUtil.generateAccessToken(member.getId(), member.getEmail());
        String refreshToken = jwtUtil.generateRefreshToken(member.getId());

        log.info("JWT 토큰 발급 완료 - memberId: {}, email: {}",
                member.getId(), member.getEmail());

        return JwtTokenResponse.of(
                accessToken,
                refreshToken,
                jwtProperties.getAccessTokenValidity()
        );
    }

    /**
     * Access Token 재발급
     */
    @Transactional(readOnly = true)
    public JwtTokenResponse refreshAccessToken(String refreshToken) {
        log.info("Access Token 재발급 요청");

        // 1. Refresh Token 유효성 검증
        if (!jwtUtil.validateToken(refreshToken)) {
            throw new IllegalArgumentException("유효하지 않은 Refresh Token입니다.");
        }

        // 2. Refresh Token에서 회원 ID 추출
        Long memberId = jwtUtil.getMemberIdFromToken(refreshToken);

        // 3. 회원 존재 여부 확인
        Member member = memberService.findById(memberId);

        // 4. 새로운 토큰 발급
        String newAccessToken = jwtUtil.generateAccessToken(member.getId(), member.getEmail());
        String newRefreshToken = jwtUtil.generateRefreshToken(member.getId());

        log.info("토큰 재발급 완료 - memberId: {}", memberId);

        return JwtTokenResponse.of(
                newAccessToken,
                newRefreshToken,
                jwtProperties.getAccessTokenValidity()
        );
    }
}