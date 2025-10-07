package com.stay.domain.auth.service;

import com.stay.config.JwtProperties;
import com.stay.domain.auth.dto.JwtTokenResponse;
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
 * 왜 필요한가?
 * - Member 도메인: 회원 정보 관리 (가입, 조회, 포인트 등)
 * - Auth 도메인: 인증/인가 처리 (로그인, JWT 발급)
 *
 * 역할 분리로 각 도메인의 책임이 명확해짐 (단일 책임 원칙)
 *
 * 트랜잭션 전략:
 * - 클래스 레벨에 @Transactional(readOnly = true) 제거!
 * - 각 메서드별로 필요한 트랜잭션 설정 적용
 * - socialLogin()은 회원 가입(INSERT)이 필요하므로 readOnly 불가
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final MemberService memberService;
    private final JwtUtil jwtUtil;
    private final JwtProperties jwtProperties;

    /**
     * 소셜 로그인 처리 및 JWT 발급
     *
     * 흐름:
     * 1. MemberService를 통해 소셜 로그인 처리 (회원가입 or 로그인)
     * 2. 로그인 성공한 회원 정보로 JWT 토큰 생성
     * 3. 프론트엔드에 토큰 응답
     *
     * @param request 소셜 로그인 정보 (provider, socialId, email 등)
     * @return JWT 토큰 (accessToken, refreshToken)
     *
     * 트랜잭션 전략:
     * - @Transactional 없음: MemberService.socialLogin()에서 이미 트랜잭션 관리
     * - JWT 생성은 트랜잭션과 무관한 작업
     * - 불필요한 트랜잭션 중복 방지
     */
    public JwtTokenResponse socialLogin(SocialLoginRequest request) {
        log.info("소셜 로그인 처리 시작 - provider: {}, email: {}",
                request.provider(), request.email());

        // 1. 회원 가입 or 로그인 처리 (MemberService에서 @Transactional 처리됨)
        Member member = memberService.socialLogin(request);

        // 2. JWT 토큰 생성 (트랜잭션 불필요)
        String accessToken = jwtUtil.generateAccessToken(member.getId(), member.getEmail());
        String refreshToken = jwtUtil.generateRefreshToken(member.getId());

        log.info("JWT 토큰 발급 완료 - memberId: {}, email: {}",
                member.getId(), member.getEmail());

        // 3. 응답 DTO 생성
        return JwtTokenResponse.of(
                accessToken,
                refreshToken,
                jwtProperties.getAccessTokenValidity()
        );
    }

    /**
     * Access Token 재발급
     *
     * 흐름:
     * 1. Refresh Token 유효성 검증
     * 2. Refresh Token에서 회원 ID 추출
     * 3. 새로운 Access Token 발급
     *
     * @param refreshToken Refresh Token
     * @return 새로운 JWT 토큰
     *
     * 왜 필요한가?
     * - Access Token은 1시간이면 만료됨
     * - 사용자가 계속 로그인 상태를 유지하려면 토큰 재발급 필요
     * - Refresh Token으로 새로운 Access Token을 받아옴
     *
     * 트랜잭션 전략:
     * - @Transactional(readOnly = true): 회원 조회만 하므로 읽기 전용
     * - 읽기 전용 트랜잭션은 성능 최적화에 도움
     */
    @Transactional(readOnly = true)
    public JwtTokenResponse refreshAccessToken(String refreshToken) {
        log.info("Access Token 재발급 요청");

        // 1. Refresh Token 검증
        if (!jwtUtil.validateToken(refreshToken)) {
            throw new IllegalArgumentException("유효하지 않은 Refresh Token입니다.");
        }

        // 2. Refresh Token 타입 확인
        String tokenType = jwtUtil.getTokenType(refreshToken);
        if (!"refresh".equals(tokenType)) {
            throw new IllegalArgumentException("Refresh Token이 아닙니다.");
        }

        // 3. 회원 ID 추출
        Long memberId = jwtUtil.getMemberIdFromToken(refreshToken);

        // 4. 회원 정보 조회 (읽기 전용 트랜잭션으로 조회)
        Member member = memberService.findById(memberId);

        // 5. 새로운 토큰 생성
        String newAccessToken = jwtUtil.generateAccessToken(member.getId(), member.getEmail());
        String newRefreshToken = jwtUtil.generateRefreshToken(member.getId());

        log.info("Access Token 재발급 완료 - memberId: {}", memberId);

        return JwtTokenResponse.of(
                newAccessToken,
                newRefreshToken,
                jwtProperties.getAccessTokenValidity()
        );
    }
}