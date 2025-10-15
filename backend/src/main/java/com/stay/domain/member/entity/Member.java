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
                @Index(name = "idx_phone", columnList = "phone_number"),
                @Index(name = "idx_nickname", columnList = "nickname")
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

<<<<<<< HEAD
<<<<<<< Updated upstream
=======
=======
>>>>>>> feature/oauth-signup-flow
    // ============ 닉네임 필드 ============

    @Column(unique = true, length = 30)
    private String nickname;
<<<<<<< HEAD

>>>>>>> Stashed changes
=======
    // =========================================

>>>>>>> feature/oauth-signup-flow
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

    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;

    @Column(name = "last_grade_updated_at")
    private LocalDateTime lastGradeUpdatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @Column(name = "profile_image_url", length = 500)
    private String profileImageUrl;

    @OneToMany(mappedBy = "member",
            cascade = {CascadeType.PERSIST, CascadeType.MERGE},
            orphanRemoval = false)
    private List<SocialLogin> socialLogins = new ArrayList<>();

    @Builder
    private Member(String email, String phoneNumber, String name, String nickname,
                   MemberRole role, String profileImageUrl) {
        validateEmail(email);
        validateName(name);
        // 닉네임은 나중에 설정할 수도 있으므로 null 허용

        this.email = email;
        this.phoneNumber = phoneNumber;
        this.name = name;
        this.nickname = nickname;
        this.role = role != null ? role : MemberRole.CUSTOMER;
        this.grade = MemberGrade.BASIC;
        this.profileImageUrl = profileImageUrl;
    }

    // ==================== 닉네임 관리 ====================

    /**
     * 닉네임 설정
     * - 회원가입 시 또는 나중에 닉네임 설정
     *
     * @param nickname 설정할 닉네임
     * @throws MemberException 닉네임이 유효하지 않을 때
     */
    public void updateNickname(String nickname) {
        validateNickname(nickname);
        this.nickname = nickname;
    }

    /**
     * 닉네임 검증
     * - 2~30자
     * - 한글, 영문, 숫자, 언더스코어만 허용
     * - 공백 불가
     */
    private void validateNickname(String nickname) {
        if (nickname == null || nickname.trim().isEmpty()) {
            throw new MemberException(MemberErrorCode.MEMBER_NICKNAME_REQUIRED);
        }

        if (nickname.length() < 2 || nickname.length() > 30) {
            throw new MemberException(MemberErrorCode.MEMBER_NICKNAME_INVALID_LENGTH);
        }

        // 한글, 영문, 숫자, 언더스코어만 허용
        if (!nickname.matches("^[가-힣a-zA-Z0-9_]+$")) {
            throw new MemberException(MemberErrorCode.MEMBER_NICKNAME_INVALID_FORMAT);
        }
    }

    // ==================== 로그인 시간 업데이트 ====================

    /**
     * 마지막 로그인 시간 업데이트
     */
    public void updateLastLoginAt() {
        this.lastLoginAt = LocalDateTime.now();
    }

    // ==================== 포인트 관리 ====================

    public void earnPoints(Integer points) {
        if (points <= 0) {
            throw new IllegalArgumentException("적립 포인트는 0보다 커야 합니다.");
        }
        this.points += points;
    }

    public void usePoints(Integer points) {
        if (points <= 0) {
            throw new IllegalArgumentException("사용 포인트는 0보다 커야 합니다.");
        }
        if (this.points < points) {
            throw new MemberException(MemberErrorCode.INSUFFICIENT_POINTS);
        }
        this.points -= points;
    }

    // ==================== 예약 카운트 관리 ====================

    public void incrementReservationCount() {
        this.reservationCount++;
    }

    // ==================== 등급 관리 ====================

    public void updateGrade(MemberGrade newGrade) {
        if (newGrade == null) {
            throw new IllegalArgumentException("등급은 null일 수 없습니다.");
        }
        this.grade = newGrade;
        this.lastGradeUpdatedAt = LocalDateTime.now();
    }

    public void upgradeToBusinessOwner() {
        if (this.role == MemberRole.BUSINESS_OWNER) {
            throw new IllegalStateException("이미 사업자 회원입니다.");
        }
        this.role = MemberRole.BUSINESS_OWNER;
    }

    // ==================== 회원 상태 관리 ====================

    public void deactivate() {
        this.isActive = false;
    }

    public void activate() {
        if (this.deletedAt != null) {
            throw new MemberException(MemberErrorCode.MEMBER_DELETED);
        }
        this.isActive = true;
    }

    public void delete() {
        this.isActive = false;
        this.deletedAt = LocalDateTime.now();
        this.points = 0;
        this.grade = MemberGrade.BASIC;
    }

    public void reactivate() {
        if (this.deletedAt == null) {
            throw new MemberException(MemberErrorCode.MEMBER_NOT_DELETED);
        }
        this.deletedAt = null;
        this.isActive = true;
    }

    // ==================== 프로필 관리 ====================

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