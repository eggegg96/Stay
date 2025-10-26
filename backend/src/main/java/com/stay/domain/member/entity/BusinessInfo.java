package com.stay.domain.member.entity;

import com.stay.domain.common.BaseEntity;
import com.stay.domain.member.exception.MemberErrorCode;
import com.stay.domain.member.exception.MemberException;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 사업자 정보 엔티티
 *
 * 왜 Member와 분리했나?
 * 1. 사업자 정보는 일반 회원에게 불필요 (테이블 정규화)
 * 2. 사업자 전용 필드가 많아질 수 있음 (확장성)
 * 3. 권한 분리 (사업자 정보 접근 제어)
 *
 * Member와의 관계:
 * - OneToOne (1:1 관계)
 * - BUSINESS_OWNER role을 가진 Member만 BusinessInfo 보유
 * - Member 삭제 시 BusinessInfo도 함께 삭제 (CascadeType.ALL)
 */
@Entity
@Table(name = "business_info",
        indexes = {
                @Index(name = "idx_business_number", columnList = "business_number"),
                @Index(name = "idx_member_id", columnList = "member_id")
        }
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class BusinessInfo extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "business_info_id")
    private Long id;

    /**
     * 연결된 회원 (OneToOne)
     * - Member의 businessInfo와 양방향 관계
     */
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false, unique = true,
            foreignKey = @ForeignKey(name = "fk_business_info_member"))
    private Member member;

    /**
     * 사업자 등록번호
     * - 형식: XXX-XX-XXXXX (10자리)
     * - 중복 불가
     */
    @Column(name = "business_number", nullable = false, unique = true, length = 12)
    private String businessNumber;

    /**
     * 회사명/사업장명
     */
    @Column(name = "company_name", nullable = false, length = 100)
    private String companyName;

    /**
     * 이메일 인증 완료 여부
     * - 사업자 회원가입 시 이메일 인증 필수
     */
    @Column(name = "email_verified", nullable = false)
    private Boolean emailVerified = false;

    /**
     * 이메일 인증 완료 시각
     */
    @Column(name = "email_verified_at")
    private LocalDateTime emailVerifiedAt;

    /**
     * 정산 계좌 - 은행명
     */
    @Column(name = "bank_name", length = 50)
    private String bankName;

    /**
     * 정산 계좌 - 계좌번호
     */
    @Column(name = "bank_account", length = 50)
    private String bankAccount;

    /**
     * 정산 계좌 - 예금주명
     */
    @Column(name = "account_holder", length = 50)
    private String accountHolder;

    /**
     * 승인 상태
     * - PENDING: 승인 대기
     * - APPROVED: 승인 완료
     * - REJECTED: 승인 거부
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "approval_status", nullable = false, length = 20)
    private ApprovalStatus approvalStatus = ApprovalStatus.PENDING;

    /**
     * 승인/거부 사유
     */
    @Column(name = "approval_note", length = 500)
    private String approvalNote;

    /**
     * 승인 처리 일시
     */
    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    // ==================== 생성자 ====================

    @Builder
    private BusinessInfo(Member member, String businessNumber,
                         String companyName, Boolean emailVerified) {
        validateMember(member);
        validateBusinessNumber(businessNumber);
        validateCompanyName(companyName);

        this.member = member;
        this.businessNumber = businessNumber;
        this.companyName = companyName;
        this.emailVerified = emailVerified != null ? emailVerified : false;
    }

    // ==================== 검증 로직 ====================

    private void validateMember(Member member) {
        if (member == null) {
            throw new MemberException(MemberErrorCode.MEMBER_REQUIRED);
        }
        if (member.getRole() != MemberRole.BUSINESS_OWNER) {
            throw new MemberException(MemberErrorCode.NOT_BUSINESS_OWNER);
        }
    }

    private void validateBusinessNumber(String businessNumber) {
        if (businessNumber == null || businessNumber.trim().isEmpty()) {
            throw new MemberException(MemberErrorCode.BUSINESS_NUMBER_REQUIRED);
        }

        // 사업자 등록번호 형식 검증 (XXX-XX-XXXXX)
        if (!businessNumber.matches("^\\d{3}-\\d{2}-\\d{5}$")) {
            throw new MemberException(MemberErrorCode.BUSINESS_NUMBER_INVALID_FORMAT);
        }
    }

    private void validateCompanyName(String companyName) {
        if (companyName == null || companyName.trim().isEmpty()) {
            throw new MemberException(MemberErrorCode.COMPANY_NAME_REQUIRED);
        }
    }

    // ==================== 비즈니스 로직 ====================

    /**
     * 이메일 인증 완료 처리
     */
    public void verifyEmail() {
        this.emailVerified = true;
        this.emailVerifiedAt = LocalDateTime.now();
    }

    /**
     * 정산 계좌 정보 등록
     */
    public void updateBankAccount(String bankName, String bankAccount, String accountHolder) {
        if (bankName == null || bankName.trim().isEmpty()) {
            throw new MemberException(MemberErrorCode.BANK_NAME_REQUIRED);
        }
        if (bankAccount == null || bankAccount.trim().isEmpty()) {
            throw new MemberException(MemberErrorCode.BANK_ACCOUNT_REQUIRED);
        }
        if (accountHolder == null || accountHolder.trim().isEmpty()) {
            throw new MemberException(MemberErrorCode.ACCOUNT_HOLDER_REQUIRED);
        }

        this.bankName = bankName;
        this.bankAccount = bankAccount;
        this.accountHolder = accountHolder;
    }

    /**
     * 사업자 승인 처리
     */
    public void approve(String note) {
        this.approvalStatus = ApprovalStatus.APPROVED;
        this.approvalNote = note;
        this.approvedAt = LocalDateTime.now();
    }

    /**
     * 사업자 승인 거부
     */
    public void reject(String reason) {
        if (reason == null || reason.trim().isEmpty()) {
            throw new MemberException(MemberErrorCode.REJECTION_REASON_REQUIRED);
        }

        this.approvalStatus = ApprovalStatus.REJECTED;
        this.approvalNote = reason;
        this.approvedAt = LocalDateTime.now();
    }

    // ==================== 편의 메서드 ====================

    /**
     * 승인 완료 여부
     */
    public boolean isApproved() {
        return this.approvalStatus == ApprovalStatus.APPROVED;
    }

    /**
     * 승인 대기 중 여부
     */
    public boolean isPending() {
        return this.approvalStatus == ApprovalStatus.PENDING;
    }

    /**
     * 승인 거부 여부
     */
    public boolean isRejected() {
        return this.approvalStatus == ApprovalStatus.REJECTED;
    }

    /**
     * 정산 계좌 등록 완료 여부
     */
    public boolean hasBankAccount() {
        return this.bankName != null && this.bankAccount != null && this.accountHolder != null;
    }

    // ==================== Enum ====================

    /**
     * 승인 상태
     */
    public enum ApprovalStatus {
        PENDING("승인 대기"),
        APPROVED("승인 완료"),
        REJECTED("승인 거부");

        private final String description;

        ApprovalStatus(String description) {
            this.description = description;
        }

        public String getDescription() {
            return description;
        }
    }
}