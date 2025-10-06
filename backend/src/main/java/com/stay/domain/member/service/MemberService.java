package com.stay.domain.member.service;

import com.stay.domain.member.dto.SocialLoginRequest;
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
 * 실무 개선 사항:
 * 1. DTO 도입으로 파라미터 6개 → 1개 (가독성 향상)
 * 2. 핵심 로직만 메서드 분리 (과도한 분리 지양)
 * 3. 예외 처리 & 로깅 강화
 *
 * 트랜잭션 전략:
 * - 조회: @Transactional(readOnly = true)
 * - 변경: @Transactional
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberService {

    private final MemberRepository memberRepository;
    private final SocialLoginRepository socialLoginRepository;

    // ==================== 소셜 로그인 ====================

    /**
     * 소셜 로그인 처리
     *
     * 실무 포인트:
     * - 기존 회원이면 로그인, 신규면 가입
     * - 하나의 트랜잭션으로 원자성 보장
     * - DTO로 파라미터 간소화
     *
     * @param request 소셜 로그인 정보
     * @return 회원 엔티티
     */
    @Transactional
    public Member socialLogin(SocialLoginRequest request) {
        log.info("소셜 로그인 시도 - provider: {}, socialId: {}",
                request.provider(), request.socialId());

        try {
            // 1. 기존 소셜 계정 조회 (회원 정보 포함)
            return socialLoginRepository
                    .findByProviderAndSocialIdWithMember(request.provider(), request.socialId())
                    .map(socialLogin -> {
                        Member member = socialLogin.getMember();

                        // 회원 상태 검증
                        if (member.getDeletedAt() != null) {
                            throw new MemberException(MemberErrorCode.MEMBER_DELETED);
                        }
                        if (!member.getIsActive()) {
                            throw new MemberException(MemberErrorCode.MEMBER_NOT_ACTIVE);
                        }

                        // 로그인 시간 업데이트
                        member.updateLastLoginAt();

                        log.info("기존 회원 로그인 - memberId: {}", member.getId());
                        return member;
                    })
                    .orElseGet(() -> {
                        // 2. 신규 회원 가입
                        log.info("신규 회원 가입 진행 - email: {}", request.email());
                        return registerSocialMember(request);
                    });

        } catch (MemberException e) {
            log.error("소셜 로그인 실패 - code: {}, message: {}", e.getCode(), e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("소셜 로그인 처리 중 예상치 못한 오류", e);
            throw new MemberException(MemberErrorCode.INTERNAL_ERROR, e);
        }
    }

    /**
     * 신규 소셜 회원 가입
     *
     * 실무 포인트:
     * - 이메일 중복 체크 필수 (다른 소셜로 이미 가입했을 수 있음)
     * - 회원 생성 + 소셜 계정 연동을 한 트랜잭션에서 처리
     */
    private Member registerSocialMember(SocialLoginRequest request) {
        // 이메일 중복 체크
        if (memberRepository.existsByEmail(request.email())) {
            log.warn("이미 가입된 이메일 - email: {}", request.email());
            throw new MemberException(MemberErrorCode.DUPLICATE_EMAIL);
        }

        // 회원 생성
        Member newMember = Member.builder()
                .email(request.email())
                .name(request.name())
                .profileImageUrl(request.profileImageUrl())
                .role(MemberRole.CUSTOMER)
                .build();

        Member savedMember = memberRepository.save(newMember);
        log.info("신규 회원 생성 완료 - memberId: {}", savedMember.getId());

        // 소셜 계정 연동
        SocialLogin socialLogin = SocialLogin.builder()
                .member(savedMember)
                .provider(request.provider())
                .socialId(request.socialId())
                .socialEmail(request.socialEmail())
                .build();

        socialLoginRepository.save(socialLogin);
        log.info("소셜 계정 연동 완료 - provider: {}", request.provider());

        return savedMember;
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
     *
     * 실무 포인트:
     * - 탈퇴/비활성 회원 접근 차단
     * - API 호출 시 권한 체크용으로 활용
     */
    public Member findActiveById(Long memberId) {
        Member member = findById(memberId);

        if (member.getDeletedAt() != null) {
            throw new MemberException(MemberErrorCode.MEMBER_DELETED);
        }

        if (!member.getIsActive()) {
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
            log.warn("사업자 회원 승급 실패 - memberId: {}, reason: {}", memberId, e.getMessage());
            throw new MemberException(MemberErrorCode.ALREADY_BUSINESS_OWNER);
        }
    }

    /**
     * 회원 비활성화
     */
    @Transactional
    public void deactivateMember(Long memberId) {
        Member member = findById(memberId);
        member.deactivate();
        log.info("회원 비활성화 완료 - memberId: {}", memberId);
    }

    /**
     * 회원 활성화
     */
    @Transactional
    public void activateMember(Long memberId) {
        Member member = findById(memberId);
        member.activate();
        log.info("회원 활성화 완료 - memberId: {}", memberId);
    }

    /**
     * 회원 탈퇴 (소프트 삭제)
     */
    @Transactional
    public void deleteMember(Long memberId) {
        Member member = findById(memberId);
        member.delete();

        // 연동된 소셜 계정 정보도 삭제
        socialLoginRepository.deleteByMember(member);

        log.info("회원 탈퇴 처리 완료 - memberId: {}", memberId);
    }

    // ==================== 포인트 관리 ====================

    /**
     * 포인트 적립
     */
    @Transactional
    public Member earnPoints(Long memberId, Integer points) {
        if (points == null || points <= 0) {
            throw new MemberException(MemberErrorCode.INVALID_POINT_AMOUNT);
        }

        Member member = findActiveById(memberId);

        try {
            member.earnPoints(points);
            log.info("포인트 적립 완료 - memberId: {}, points: +{}, total: {}",
                    memberId, points, member.getPoints());
            return member;
        } catch (IllegalArgumentException e) {
            log.error("포인트 적립 실패 - memberId: {}, points: {}", memberId, points, e);
            throw new MemberException(MemberErrorCode.INVALID_POINT_AMOUNT);
        }
    }

    /**
     * 포인트 사용
     */
    @Transactional
    public Member usePoints(Long memberId, Integer points) {
        if (points == null || points <= 0) {
            throw new MemberException(MemberErrorCode.INVALID_POINT_AMOUNT);
        }

        Member member = findActiveById(memberId);

        try {
            member.usePoints(points);
            log.info("포인트 사용 완료 - memberId: {}, points: -{}, remaining: {}",
                    memberId, points, member.getPoints());
            return member;
        } catch (IllegalStateException e) {
            log.warn("포인트 부족 - memberId: {}, requested: {}, current: {}",
                    memberId, points, member.getPoints());
            throw new MemberException(MemberErrorCode.INSUFFICIENT_POINTS);
        } catch (IllegalArgumentException e) {
            log.error("포인트 사용 실패 - memberId: {}, points: {}", memberId, points, e);
            throw new MemberException(MemberErrorCode.INVALID_POINT_AMOUNT);
        }
    }

    // ==================== 등급 관리 ====================

    /**
     * 회원 등급 갱신
     *
     * 실무 포인트:
     * - 배치 작업에서 호출 예정
     * - 예약 횟수 기반으로 등급 산정
     */
    @Transactional
    public Member updateGrade(Long memberId, int reservationCount) {
        Member member = findActiveById(memberId);

        MemberGrade newGrade = MemberGrade.determineGrade(reservationCount);
        member.updateGrade(newGrade);

        log.info("회원 등급 갱신 완료 - memberId: {}, grade: {} (예약 {}회)",
                memberId, newGrade, reservationCount);
        return member;
    }

    /**
     * 등급 갱신 대상 회원 목록 조회
     *
     * 실무 포인트:
     * - 스케줄러에서 매달 1일 실행 예정
     * - 마지막 갱신일이 30일 이전인 회원 대상
     */
    public List<Member> findMembersForGradeUpdate(int daysAgo) {
        LocalDateTime targetDate = LocalDateTime.now().minusDays(daysAgo);
        return memberRepository.findMembersForGradeUpdate(targetDate);
    }

    // ==================== 통계 ====================

    /**
     * 활성 회원 수 조회
     */
    public long countActiveMembers() {
        return memberRepository.countActiveMembers();
    }

    /**
     * 사업자 회원 목록 조회
     */
    public List<Member> findBusinessOwners() {
        return memberRepository.findBusinessOwners();
    }
}