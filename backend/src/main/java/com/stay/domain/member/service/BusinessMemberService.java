package com.stay.domain.member.service;

import com.stay.domain.member.entity.BusinessInfo;
import com.stay.domain.member.entity.Member;
import com.stay.domain.member.entity.MemberRole;
import com.stay.domain.member.exception.MemberErrorCode;
import com.stay.domain.member.exception.MemberException;
import com.stay.domain.member.repository.BusinessInfoRepository;
import com.stay.domain.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 사업자 회원 Service
 *
 * 주요 기능:
 * 1. 사업자 회원가입
 * 2. 사업자 등록번호 검증
 * 3. 이메일 인증 처리
 * 4. 사업자 정보 조회/수정
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BusinessMemberService {

    private final MemberRepository memberRepository;
    private final BusinessInfoRepository businessInfoRepository;

    // ==================== 사업자 등록번호 검증 ====================

    /**
     * 사업자 등록번호 중복 체크
     *
     * 왜 필요한가?
     * - 한 사업자 등록번호로 중복 가입 방지
     * - 회원가입 폼에서 실시간 검증
     *
     * @param businessNumber 사업자 등록번호 (XXX-XX-XXXXX)
     * @return 사용 가능 여부
     */
    public boolean isBusinessNumberAvailable(String businessNumber) {

        return !businessInfoRepository.existsByBusinessNumber(businessNumber);
    }

    // ==================== 사업자 회원가입 ====================

    /**
     * 사업자 회원가입
     *
     * @param email 이메일
     * @param password 비밀번호 (암호화 필요 - 나중에 추가)
     * @param name 이름
     * @param phoneNumber 전화번호
     * @param businessNumber 사업자 등록번호
     * @param companyName 회사명
     * @return 생성된 Member
     */
    @Transactional
    public Member registerBusinessMember(
            String email,
            String password,
            String name,
            String phoneNumber,
            String businessNumber,
            String companyName
    ) {
        log.info("========================================");
        log.info("사업자 회원가입 시작 - email: {}, businessNumber: {}", email, businessNumber);

        // 1. 이메일 중복 체크
        if (memberRepository.existsByEmail(email)) {
            throw new MemberException(MemberErrorCode.DUPLICATE_EMAIL);
        }

        // 2. 사업자 등록번호 중복 체크
        if (businessInfoRepository.existsByBusinessNumber(businessNumber)) {
            throw new MemberException(MemberErrorCode.DUPLICATE_BUSINESS_NUMBER);
        }

        // 3. Member 생성
        Member member = Member.builder()
                .email(email)
                .password(password)
                .name(name)
                .phoneNumber(phoneNumber)
                .role(MemberRole.BUSINESS_OWNER)
                .build();

        // 4. Member 저장
        Member savedMember = memberRepository.save(member);

        // 5. BusinessInfo 생성 및 저장
        BusinessInfo businessInfo = BusinessInfo.builder()
                .member(savedMember)
                .businessNumber(businessNumber)
                .companyName(companyName)
                .emailVerified(false)
                .build();

        // 6. BusinessInfo 저장
        businessInfoRepository.save(businessInfo);

        log.info("사업자 회원가입 완료 - memberId: {}", savedMember.getId());
        log.info("========================================");

        return savedMember;
    }

    // ==================== 이메일 인증 ====================

    /**
     * 이메일 인증 완료 처리
     *
     * 왜 필요한가?
     * - 사업자 회원가입 시 이메일 인증 필수
     * - 이메일 인증 링크 클릭 시 호출됨
     *
     * @param memberId 회원 ID
     */
    @Transactional
    public void verifyBusinessEmail(Long memberId) {
        log.info("이메일 인증 처리 - memberId: {}", memberId);

        // 1. BusinessInfo 조회
        BusinessInfo businessInfo = businessInfoRepository
                .findByMemberId(memberId)
                .orElseThrow(() -> new MemberException(MemberErrorCode.BUSINESS_INFO_NOT_FOUND));

        // 2. 이메일 인증 완료 처리
        businessInfo.verifyEmail();

        log.info("이메일 인증 완료 - memberId: {}", memberId);
    }

    // ==================== 사업자 정보 조회 ====================

    /**
     * 사업자 정보 조회 (Member ID로)
     *
     * 사용 예시:
     * - 사업자 대시보드에서 내 정보 불러오기
     * - 정산 계좌 정보 확인
     *
     * @param memberId 회원 ID
     * @return 사업자 정보
     */
    public BusinessInfo getBusinessInfo(Long memberId) {
        return businessInfoRepository
                .findByMemberId(memberId)
                .orElseThrow(() -> new MemberException(MemberErrorCode.BUSINESS_INFO_NOT_FOUND));
    }

    /**
     * 사업자 등록번호로 조회
     *
     * @param businessNumber 사업자 등록번호
     * @return 사업자 정보
     */
    public BusinessInfo getBusinessInfoByNumber(String businessNumber) {
        return businessInfoRepository
                .findByBusinessNumber(businessNumber)
                .orElseThrow(() -> new MemberException(MemberErrorCode.BUSINESS_INFO_NOT_FOUND));
    }

    // ==================== 정산 계좌 관리 ====================

    /**
     * 정산 계좌 등록
     *
     * @param memberId 회원 ID
     * @param bankName 은행명
     * @param bankAccount 계좌번호
     * @param accountHolder 예금주
     */
    @Transactional
    public void updateBankAccount(
            Long memberId,
            String bankName,
            String bankAccount,
            String accountHolder
    ) {
        log.info("정산 계좌 등록 - memberId: {}", memberId);

        // 1. BusinessInfo 조회
        BusinessInfo businessInfo = getBusinessInfo(memberId);

        // 2. 계좌 정보 업데이트
        businessInfo.updateBankAccount(bankName, bankAccount, accountHolder);

        log.info("정산 계좌 등록 완료 - memberId: {}", memberId);
    }

    // ==================== 승인 관리 (관리자용) ====================

    /**
     * 승인 대기 중인 사업자 목록 조회
     *
     * @return 승인 대기 목록
     */
    public List<BusinessInfo> getPendingBusinessList() {
        return businessInfoRepository.findByApprovalStatus(BusinessInfo.ApprovalStatus.PENDING);
    }

    /**
     * 사업자 승인 처리
     *
     * @param businessInfoId 사업자 정보 ID
     * @param note 승인 메모
     */
    @Transactional
    public void approveBusinessMember(Long businessInfoId, String note) {
        log.info("사업자 승인 처리 - businessInfoId: {}", businessInfoId);

        // 1. BusinessInfo 조회
        BusinessInfo businessInfo = businessInfoRepository
                .findById(businessInfoId)
                .orElseThrow(() -> new MemberException(MemberErrorCode.BUSINESS_INFO_NOT_FOUND));

        // 2. 승인 처리
        businessInfo.approve(note);

        log.info("사업자 승인 완료 - businessInfoId: {}", businessInfoId);
    }

    /**
     * 사업자 승인 거부
     *
     * @param businessInfoId 사업자 정보 ID
     * @param reason 거부 사유
     */
    @Transactional
    public void rejectBusinessMember(Long businessInfoId, String reason) {
        log.info("사업자 승인 거부 - businessInfoId: {}", businessInfoId);

        BusinessInfo businessInfo = businessInfoRepository
                .findById(businessInfoId)
                .orElseThrow(() -> new MemberException(MemberErrorCode.BUSINESS_INFO_NOT_FOUND));

        businessInfo.reject(reason);

        log.info("사업자 승인 거부 완료 - businessInfoId: {}", businessInfoId);
    }
}