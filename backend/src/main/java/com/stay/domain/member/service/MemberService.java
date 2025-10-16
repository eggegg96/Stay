package com.stay.domain.member.service;

import com.stay.domain.member.dto.SocialLoginRequest;
import com.stay.domain.member.dto.SocialLoginResult;
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
     * - 기존 회원이면 로그인, 신규면 가입
     * - 하나의 트랜잭션으로 원자성 보장
     * - DTO로 파라미터 간소화
     *
     * @param request 소셜 로그인 정보
     * @return 회원 엔티티
     */
    @Transactional
    public SocialLoginResult socialLogin(SocialLoginRequest request) {
        try {
            log.info("소셜 로그인 처리 시작 - provider: {}, email: {}",
                    request.provider(), request.email());

            final boolean[] isNewMember = {false}; // 신규 회원 플래그

            // ========== 1. 소셜 계정으로 회원 조회 ==========
            Member member = socialLoginRepository
                    .findByProviderAndSocialId(request.provider(), request.socialId())
                    .map(socialLogin -> {
                        Member existingMember = socialLogin.getMember();

                        // 탈퇴 회원 재활성화
                        if (!existingMember.getIsActive() && existingMember.getDeletedAt() != null) {
                            log.info("탈퇴 회원 재활성화 - memberId: {}", existingMember.getId());
                            existingMember.reactivate();
                        }

                        if (!existingMember.getIsActive()) {
                            throw new MemberException(MemberErrorCode.MEMBER_NOT_ACTIVE);
                        }

                        existingMember.updateLastLoginAt();
                        log.info("기존 회원 로그인 - memberId: {}", existingMember.getId());

                        return existingMember;
                    })
                    .orElseGet(() -> {
                        log.info("신규 회원 가입 진행 - email: {}", request.email());
                        isNewMember[0] = true; // 신규 회원 플래그 설정
                        return registerSocialMember(request);
                    });

            // SocialLoginResult 반환 (Member + isNewMember)
            return new SocialLoginResult(member, isNewMember[0]);

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
// ==================== 닉네임 관리 ====================

    /**
     * 닉네임 중복 체크
     *
     * 왜 필요한가?
     * - 프론트엔드에서 사용자가 닉네임 입력할 때 실시간으로 중복 여부를 확인
     * - 회원가입/수정 시 닉네임이 이미 사용 중인지 검증
     *
     * @param nickname 확인할 닉네임
     * @return true: 사용 가능, false: 이미 사용 중
     *
     * 사용 예시 (Controller에서):
     * ```java
     * @GetMapping("/members/check-nickname")
     * public ResponseEntity<Boolean> checkNickname(@RequestParam String nickname) {
     *     boolean available = memberService.isNicknameAvailable(nickname);
     *     return ResponseEntity.ok(available);
     * }
     * ```
     */
    @Transactional(readOnly = true)
    public boolean isNicknameAvailable(String nickname) {
        if (nickname == null || nickname.trim().isEmpty()) {
            return false;
        }
        return !memberRepository.existsByNickname(nickname);
    }

    /**
     * 회원 닉네임 설정
     *
     * 왜 필요한가?
     * - 소셜 로그인 후 닉네임을 설정하는 단계에서 사용
     * - 닉네임 변경 기능에서도 사용 가능
     *
     * - 닉네임 중복 체크 필수
     * - 엔티티 내부의 검증 로직(validateNickname)도 실행됨
     *
     * @param memberId 회원 ID
     * @param nickname 설정할 닉네임
     * @return 업데이트된 회원 정보
     * @throws MemberException 닉네임이 중복되거나 유효하지 않을 때
     */
    @Transactional
    public Member updateNickname(Long memberId, String nickname) {
        log.info("닉네임 설정 시작 - memberId: {}, nickname: {}", memberId, nickname);

        // 1. 회원 조회
        Member member = findActiveById(memberId);

        // 2. 닉네임 중복 체크
        // 본인의 기존 닉네임이 아닌 경우에만 중복 체크
        if (!nickname.equals(member.getNickname())) {
            if (memberRepository.existsByNickname(nickname)) {
                log.warn("닉네임 중복 - nickname: {}", nickname);
                throw new MemberException(MemberErrorCode.DUPLICATE_NICKNAME);
            }
        }

        // 3. 닉네임 설정 (엔티티 내부 검증 로직 실행)
        try {
            member.updateNickname(nickname);
            log.info("닉네임 설정 완료 - memberId: {}, nickname: {}", memberId, nickname);
            return member;
        } catch (MemberException e) {
            log.error("닉네임 검증 실패 - memberId: {}, nickname: {}", memberId, nickname);
            throw e;
        }
    }

    /**
     * 닉네임으로 회원 조회
     *
     * 왜 필요한가?
     * - 헤더나 프로필 페이지에서 닉네임으로 회원 정보 조회
     * - 다른 사용자의 프로필 보기 기능 구현 시 사용
     *
     * @param nickname 조회할 닉네임
     * @return 회원 정보
     * @throws MemberException 회원을 찾을 수 없을 때
     */
    @Transactional(readOnly = true)
    public Member findByNickname(String nickname) {
        return memberRepository.findByNickname(nickname)
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
//        socialLoginRepository.deleteByMember(member);

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
     * 회원 등급 재계산
     * - 배치 작업에서 호출 예정
     * - Member가 자신의 예약 횟수로 등급을 재계산
     * - MemberGrade.determineGrade()가 비즈니스 로직 담당
     */
    @Transactional
    public Member recalculateMemberGrade(Long memberId) {
        Member member = findActiveById(memberId);

        // Member가 스스로 등급 재계산 (캡슐화)
        member.recalculateGrade();

        log.info("회원 등급 갱신 완료 - memberId: {}, grade: {} (예약 {}회, 할인율: {}%)",
                memberId,
                member.getGrade().getDisplayName(),
                member.getReservationCount(),
                member.getGrade().getDiscountRate() * 100);

        return member;
    }

    /**
     * 등급 갱신 대상 회원 목록 조회
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