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
import java.util.ArrayList;
import java.util.List;

/**
 * 회원 엔티티
 */
@Entity
@Table(name = "members",
        indexes = {
                @Index(name = "idx_email", columnList = "email"),
                @Index(name = "idx_phone", columnList = "phone_number")
        }
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Member extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "member_id")
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(name = "phone_number", length = 20)
    private String phoneNumber;

    @Column(nullable = false, length = 50)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private MemberRole role;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private MemberGrade grade;

    @Column(nullable = false)
    private Integer reservationCount = 0;

    @Column(nullable = false)
    private Integer points = 0;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "last_grade_updated_at")
    private LocalDateTime lastGradeUpdatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    // 프로필 이미지 URL (소셜 로그인용)
    @Column(name = "profile_image_url", length = 500)
    private String profileImageUrl;

    // SocialLogin과의 관계 (일대다)
    @OneToMany(mappedBy = "member",
            cascade = {CascadeType.PERSIST, CascadeType.MERGE},
            orphanRemoval = false)
    private List<SocialLogin> socialLogins = new ArrayList<>();

    @Builder
    private Member(String email, String phoneNumber, String name, MemberRole role, String profileImageUrl) {
        validateEmail(email);
        validateName(name);

        this.email = email;
        this.phoneNumber = phoneNumber;
        this.name = name;
        this.role = role != null ? role : MemberRole.CUSTOMER;
        this.grade = MemberGrade.BASIC;
        this.reservationCount = 0;
        this.points = 0;
        this.isActive = true;
        this.profileImageUrl = profileImageUrl;
        this.lastGradeUpdatedAt = LocalDateTime.now();
    }
    // ==================== 비즈니스 로직 ====================

    /**
     * 예약 완료 시 호출
     * - 예약 횟수 증가
     * - 등급 갱신 체크
     */
    public void completeReservation() {
        this.reservationCount++;
        updateGradeIfNeeded();
    }

    /**
     * 포인트 적립
     */
    public void earnPoints(int amount) {
        if (amount < 0) {
            throw new MemberException(MemberErrorCode.INVALID_POINT_AMOUNT);
        }
        this.points += amount;
    }

    /**
     * 포인트 사용
     */
    public void usePoints(int amount) {
        if (amount < 0) {
            throw new MemberException(MemberErrorCode.INVALID_POINT_AMOUNT);
        }
        if (this.points < amount) {
            throw new MemberException(
                    MemberErrorCode.INSUFFICIENT_POINTS,
                    String.format("포인트가 부족합니다. (보유: %d, 사용시도: %d)", this.points, amount)
            );
        }
        this.points -= amount;
    }

    /**
     * 회원 등급 갱신
     */
    public void updateGradeIfNeeded() {
        MemberGrade newGrade = MemberGrade.determineGrade(this.reservationCount);

        if (this.grade != newGrade) {
            this.grade = newGrade;
            this.lastGradeUpdatedAt = LocalDateTime.now();
        }
    }

    /**
     * 회원 등급 강제 갱신 (관리자용)
     */
    public void updateGrade(MemberGrade newGrade) {
        this.grade = newGrade;
        this.lastGradeUpdatedAt = LocalDateTime.now();
    }

    /**
     * 사업자 회원으로 승급
     */
    public void upgradeToBusinessOwner() {
        if (this.role == MemberRole.BUSINESS_OWNER) {
            throw new MemberException(MemberErrorCode.ALREADY_BUSINESS_OWNER);
        }
        this.role = MemberRole.BUSINESS_OWNER;
    }

    // ==================== 회원 상태 관리 ====================

    /**
     * 마지막 로그인 시간 업데이트
     *
     * 실무 포인트:
     * - BaseEntity의 updatedAt이 자동으로 갱신됨
     */
    public void updateLastLoginAt() {
        // BaseEntity의 @LastModifiedDate가 자동으로 updatedAt 갱신
    }

    /**
     * 회원 비활성화
     *
     * 사용 케이스:
     * - 관리자의 회원 정지
     * - 휴면 계정 전환
     */
    public void deactivate() {
        this.isActive = false;
    }

    /**
     * 회원 활성화
     */
    public void activate() {
        if (this.deletedAt != null) {
            throw new MemberException(MemberErrorCode.MEMBER_DELETED);
        }
        this.isActive = true;
    }

    /**
     * 회원 탈퇴 (소프트 삭제)
     *
     * - 실제 DB에서 삭제하지 않음
     * - deletedAt 설정 + 비활성화
     */
    public void delete() {
        this.isActive = false;
        this.deletedAt = LocalDateTime.now();
        this.points = 0;  // 포인트 초기화
        this.grade = MemberGrade.BASIC;  // 등급 초기화
    }


    /**
     * 회원 재활성화
     *
     * 사용 케이스:
     * - 탈퇴 후 24시간 경과 시 재로그인 허용
     * - 탈퇴 상태를 되돌리고 활성화
     *
     * 주의:
     * - 탈퇴하지 않은 회원에게는 호출 불가
     * - 포인트, 등급은 이미 delete() 시 초기화됨
     * - 예약 내역은 보존됨
     */
    public void reactivate() {
        if (this.deletedAt == null) {
            throw new MemberException(MemberErrorCode.MEMBER_NOT_DELETED);
        }

        this.deletedAt = null;
        this.isActive = true;
    }


    // ==================== 프로필 관리 ====================

    /**
     * 프로필 이미지 URL 업데이트
     */
    public void updateProfileImageUrl(String profileImageUrl) {
        this.profileImageUrl = profileImageUrl;
    }

    // ==================== Validation ====================

    private void validateEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new MemberException(MemberErrorCode.MEMBER_EMAIL_REQUIRED);
        }
        if (!email.matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new MemberException(MemberErrorCode.MEMBER_EMAIL_INVALID_FORMAT);
        }
    }

    private void validateName(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new MemberException(MemberErrorCode.MEMBER_NAME_REQUIRED);
        }
        if (name.length() > 50) {
            throw new MemberException(MemberErrorCode.MEMBER_NAME_TOO_LONG);
        }
    }

    // ==================== 편의 메서드 ====================

    public boolean isCustomer() {
        return this.role == MemberRole.CUSTOMER;
    }

    public boolean isBusinessOwner() {
        return this.role == MemberRole.BUSINESS_OWNER;
    }

    public boolean isAdmin() {
        return this.role == MemberRole.ADMIN;
    }

    public boolean isActiveMember() {
        return this.isActive && this.deletedAt == null;
    }
}