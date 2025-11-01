package com.stay.domain.auth.service;

import com.stay.config.JwtProperties;
import com.stay.domain.auth.dto.JwtTokenResponse;
import com.stay.domain.auth.dto.OAuthLoginRequest;
import com.stay.domain.auth.util.JwtUtil;
import com.stay.domain.member.dto.SocialLoginRequest;
import com.stay.domain.member.dto.SocialLoginResult;
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
     * OAuth 로그인 처리
     *
     * 변경 사항:
     * - 기존: OAuth 인증 후 바로 회원가입 (nickname=NULL)
     * - 신규: 기존 회원은 로그인, 신규 회원은 OAuth 정보만 반환
     *
     * 흐름:
     * 1. OAuth 처리: code → 사용자 정보
     * 2. 이메일로 기존 회원 확인
     *    - 기존 회원: 로그인 처리 (토큰 발급)
     *    - 신규 회원: OAuth 정보만 반환 (DB 저장 X)
     *
     * @param request OAuth 로그인 요청 (provider, code)
     * @return JWT 토큰 (기존 회원) 또는 OAuth 정보 (신규 회원)
     */
    public JwtTokenResponse oauthLogin(OAuthLoginRequest request) {
        log.info("OAuth 로그인 처리 시작 - provider: {}", request.provider());

        // 1. OAuth 처리: code → 사용자 정보
        SocialLoginRequest socialLoginRequest = oauthService.processOAuthLogin(
                request.provider(),
                request.code()
        );

        log.info("OAuth 사용자 정보 조회 완료 - email: {}", socialLoginRequest.email());

        // 2. 이메일로 기존 회원인지 확인
        boolean alreadyExists = memberService.existsByEmail(socialLoginRequest.email());

        if (alreadyExists) {
            // 기존 회원: 로그인 처리
            log.info("기존 회원 로그인 - email: {}", socialLoginRequest.email());

            SocialLoginResult result = memberService.socialLogin(socialLoginRequest);

            // JWT 토큰 발급
            String accessToken = jwtUtil.generateAccessToken(
                    result.getMember().getId(),
                    result.getMember().getEmail()
            );
            String refreshToken = jwtUtil.generateRefreshToken(result.getMember().getId());

            log.info("OAuth 로그인 완료 - memberId: {}, email: {}",
                    result.getMember().getId(),
                    result.getMember().getEmail());

            return JwtTokenResponse.of(
                    accessToken,
                    refreshToken,
                    jwtProperties.getAccessTokenValidity(),
                    false,  // 기존 회원
                    result.getMember().getEmail()
            );

        } else {
            // 신규 회원: OAuth 정보만 반환 (DB 저장 X)
            log.info("신규 회원 - OAuth 정보 반환 - email: {}", socialLoginRequest.email());

            return JwtTokenResponse.ofNewMember(
                    socialLoginRequest.email(),
                    socialLoginRequest.provider().name(),
                    socialLoginRequest.socialId(),
                    socialLoginRequest.name(),
                    socialLoginRequest.profileImageUrl()
            );
        }
    }

    /**
     * OAuth 최종 회원가입 처리 (닉네임 포함)
     *
     * 왜 필요한가?
     * - 기존 oauthLogin()은 OAuth 인증 후 바로 DB 저장 (nickname=NULL 문제)
     * - 이 메서드는 닉네임까지 받은 후 한 번에 저장 (깔끔한 데이터!)
     *
     * 흐름:
     * 1. 프론트에서 OAuth 인증 후 sessionStorage에 임시 저장
     * 2. 사용자가 닉네임 입력
     * 3. 이 API 호출 → 한 번에 회원가입 완료!
     *
     * @param request OAuth 정보 + 닉네임 (SocialLoginRequest)
     * @return JWT 토큰 (로그인 완료)
     */
    @Transactional
    public JwtTokenResponse registerWithOAuth(SocialLoginRequest request) {
        log.info("OAuth 최종 회원가입 시작 - provider: {}, email: {}, nickname: {}",
                request.provider(),
                request.email(),
                request.nickname());

        // 1. 닉네임 중복 체크
        if (memberService.existsByNickname(request.nickname())) {  // ← MemberService 사용!
            log.warn("닉네임 중복 - nickname: {}", request.nickname());
            throw new IllegalArgumentException("이미 사용 중인 닉네임입니다");
        }

        // 2. 이메일로 이미 가입된 회원인지 확인
        if (memberService.existsByEmail(request.email())) {  // ← MemberService 사용!
            log.warn("이미 가입된 이메일 - email: {}", request.email());
            throw new IllegalArgumentException("이미 가입된 계정입니다");
        }

        // 3. 회원 가입 처리
        Member savedMember = memberService.registerSocialMember(request);

        // 4. JWT 토큰 발급
        String accessToken = jwtUtil.generateAccessToken(
                savedMember.getId(),
                savedMember.getEmail()
        );
        String refreshToken = jwtUtil.generateRefreshToken(savedMember.getId());

        log.info("OAuth 최종 회원가입 완료 - memberId: {}, email: {}, nickname: {}",
                savedMember.getId(),
                savedMember.getEmail(),
                savedMember.getNickname());

        return JwtTokenResponse.of(
                accessToken,
                refreshToken,
                jwtProperties.getAccessTokenValidity(),
                false,
                savedMember.getEmail()
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

        SocialLoginResult result = memberService.socialLogin(request);

        String accessToken = jwtUtil.generateAccessToken(
                result.getMember().getId(),
                result.getMember().getEmail()
        );
        String refreshToken = jwtUtil.generateRefreshToken(result.getMember().getId());

        log.info("JWT 토큰 발급 완료 - memberId: {}, email: {}",
                result.getMember().getId(),
                result.getMember().getEmail()
        );

        return JwtTokenResponse.of(
                accessToken,
                refreshToken,
                jwtProperties.getAccessTokenValidity(),
                result.isNewMember(),
                result.getMember().getEmail()
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

        // 재발급은 기존 회원이므로 3개 파라미터 버전 사용
        return JwtTokenResponse.of(
                newAccessToken,
                newRefreshToken,
                jwtProperties.getAccessTokenValidity()
        );
    }
}