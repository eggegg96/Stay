package com.stay.domain.member.service;

import com.stay.domain.member.entity.*;
import com.stay.domain.member.exception.MemberErrorCode;
import com.stay.domain.member.exception.MemberException;
import com.stay.domain.member.repository.MemberRepository;
import com.stay.domain.member.repository.SocialLoginRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 회원 서비스
 *
 * 트랜잭션 전략:
 * - 조회: @Transactional(readOnly = true) - 성능 최적화
 * - 변경: @Transactional - 데이터 정합성 보장
 *
 * 에러 처리:
 * - 비즈니스 예외는 MemberException으로 통일
 * - 로그는 Slf4j 활용
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberService {

    private final MemberRepository memberRepository;
    private final SocialLoginRepository socialLoginRepository;

    // ==================== 회원 가입 ====================

    /**
     * 소셜 로그인으로 회원 가입 또는 로그인
     */
    @Transactional
    public Member registerOrLoginWithSocial(
            SocialProvider provider,
            String socialId,
            String email,
            String name,
            String socialEmail,
            String profileImageUrl
    ) {
        log.info("소셜 로그인 시도 - provider: {}, socialId: {}", provider, socialId);

        // 1. 소셜 로그인 정보로 기존 회원 조회
        return socialLoginRepository.findByProviderAndSocialIdWithMember(provider, socialId)
                .map(socialLogin -> {
                    // 기존 회원 - 소셜 정보 업데이트
                    log.info("기존 회원 로그인 - memberId: {}", socialLogin.getMember().getId());
                    socialLogin.updateSocialInfo(socialEmail, name, profileImageUrl);
                    return socialLogin.getMember();
                })
                .orElseGet(() -> {
                    // 신규 회원 - 회원가입 처리
                    log.info("신규 회원 가입 - email: {}", email);

                    // 이메일 중복 체크
                    if (memberRepository.existsByEmail(email)) {
                        throw new MemberException(MemberErrorCode.DUPLICATE_EMAIL);
                    }

                    // 회원 생성
                    Member newMember = Member.builder()
                            .email(email)
                            .name(name)
                            .role(MemberRole.CUSTOMER)
                            .build();

                    Member savedMember = memberRepository.save(newMember);

                    // 소셜 로그인 정보 생성
                    SocialLogin socialLogin = SocialLogin.builder()
                            .member(savedMember)
                            .provider(provider)
                            .socialId(socialId)
                            .socialEmail(socialEmail)
                            .socialName(name)
                            .profileImageUrl(profileImageUrl)
                            .build();

                    socialLoginRepository.save(socialLogin);

                    log.info("신규 회원 가입 완료 - memberId: {}", savedMember.getId());
                    return savedMember;
                });
    }

    // ==================== 회원 조회 ====================

    /**
     * ID로 회원 조회
     */
    public Member findById(Long memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(() -> new MemberException(MemberErrorCode.MEMBER_NOT_FOUND));
    }

    /**
     * 활성 회원만 조회
     */
    public Member findActiveById(Long memberId) {
        Member member = findById(memberId);

        if (!member.isActiveMember()) {
            if (member.getDeletedAt() != null) {
                throw new MemberException(MemberErrorCode.MEMBER_DELETED);
            }
            throw new MemberException(MemberErrorCode.MEMBER_NOT_ACTIVE);
        }

        return member;
    }

    /**
     * 이메일로 회원 조회
     */
    public Member findByEmail(String email) {
        return memberRepository.findByEmail(email)
                .orElseThrow(() -> new MemberException(MemberErrorCode.MEMBER_NOT_FOUND));
    }

    /**
     * 이메일로 활성 회원 조회
     */
    public Member findActiveByEmail(String email) {
        return memberRepository.findActiveByEmail(email)
                .orElseThrow(() -> new MemberException(MemberErrorCode.MEMBER_NOT_FOUND));
    }

    // ==================== 회원 정보 수정 ====================

    /**
     * 사업자 회원으로 승급
     */
    @Transactional
    public Member upgradeToBusinessOwner(Long memberId) {
        Member member = findActiveById(memberId);

        try {
            member.upgradeToBusinessOwner();
            log.info("사업자 회원 승급 완료 - memberId: {}", memberId);
            return member;
        } catch (IllegalStateException e) {
            throw new MemberException(MemberErrorCode.ALREADY_BUSINESS_OWNER);
        }
    }

    // ==================== 포인트 관리 ====================

    /**
     * 포인트 적립
     */
    @Transactional
    public void earnPoints(Long memberId, int amount) {
        Member member = findActiveById(memberId);
        member.earnPoints(amount);
        log.info("포인트 적립 - memberId: {}, amount: {}", memberId, amount);
    }

    /**
     * 포인트 사용
     */
    @Transactional
    public void usePoints(Long memberId, int amount) {
        Member member = findActiveById(memberId);
        member.usePoints(amount);
        log.info("포인트 사용 - memberId: {}, amount: {}", memberId, amount);
    }

    // ==================== 예약 관련 ====================

    /**
     * 예약 완료 처리
     * - 예약 횟수 증가
     * - 등급 자동 갱신
     */
    @Transactional
    public void completeReservation(Long memberId) {
        Member member = findActiveById(memberId);
        member.completeReservation();
        log.info("예약 완료 처리 - memberId: {}, 예약횟수: {}, 등급: {}",
                memberId, member.getReservationCount(), member.getGrade());
    }

    // ==================== 등급 관리 ====================

    /**
     * 등급 갱신 (배치 작업용)
     * - 최근 2년 기준으로 등급 재계산
     * - 주기적으로 실행 (예: 매일 새벽 3시)
     */
    @Transactional
    public void updateGrade(Long memberId, int recentTwoYearsReservationCount) {
        Member member = findActiveById(memberId);

        MemberGrade newGrade = MemberGrade.determineGrade(recentTwoYearsReservationCount);

        if (member.getGrade() != newGrade) {
            log.info("등급 변경 - memberId: {}, 기존등급: {}, 신규등급: {}",
                    memberId, member.getGrade(), newGrade);
        }

        member.updateGradeIfNeeded();
    }

    /**
     * 등급 갱신 대상 회원 조회
     * - 마지막 갱신일이 30일 이전인 회원들
     */
    public List<Member> findMembersForGradeUpdate() {
        LocalDateTime targetDate = LocalDateTime.now().minusDays(30);
        return memberRepository.findMembersForGradeUpdate(targetDate);
    }

    // ==================== 회원 상태 관리 ====================

    /**
     * 회원 정지
     */
    @Transactional
    public void deactivateMember(Long memberId) {
        Member member = findById(memberId);
        member.deactivate();
        log.info("회원 정지 - memberId: {}", memberId);
    }

    /**
     * 회원 활성화
     */
    @Transactional
    public void activateMember(Long memberId) {
        Member member = findById(memberId);
        member.activate();
        log.info("회원 활성화 - memberId: {}", memberId);
    }

    /**
     * 회원 탈퇴
     */
    @Transactional
    public void deleteMember(Long memberId) {
        Member member = findActiveById(memberId);
        member.delete();
        log.info("회원 탈퇴 - memberId: {}", memberId);
    }

    // ==================== 통계 ====================

    /**
     * 활성 회원 수 조회
     */
    public long countActiveMembers() {
        return memberRepository.countActiveMembers();
    }

    /**
     * 기간별 신규 가입자 수
     */
    public long countNewMembersBetween(LocalDateTime startDate, LocalDateTime endDate) {
        return memberRepository.countNewMembersBetween(startDate, endDate);
    }
}