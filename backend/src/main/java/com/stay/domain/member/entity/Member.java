package com.stay.domain.member.entity;

import com.stay.domain.common.BaseEntity;
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
 *
 * 설계 원칙:
 * 1. 불변성 보장: Setter 없이 생성자/빌더로만 생성
 * 2. 도메인 로직 캡슐화: 비즈니스 규칙은 엔티티 내부에서 처리
 * 3. 명확한 책임 분리: 등급 관련 로직은 별도 메서드로 분리
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

    // SocialLogin과의 관계 (일대다)
    // ⚠️ 아직 SocialLogin 클래스 없어서 빨간 줄 나올 수 있음 (다음 단계에서 해결!)
    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SocialLogin> socialLogins = new ArrayList<>();

    @Builder
    private Member(String email, String phoneNumber, String name, MemberRole role) {
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
            throw new IllegalArgumentException("포인트는 0 이상이어야 합니다.");
        }
        this.points += amount;
    }

    /**
     * 포인트 사용
     */
    public void usePoints(int amount) {
        if (amount < 0) {
            throw new IllegalArgumentException("포인트는 0 이상이어야 합니다.");
        }
        if (this.points < amount) {
            throw new IllegalArgumentException(
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
     * 회원 정지
     */
    public void deactivate() {
        this.isActive = false;
    }

    /**
     * 회원 활성화
     */
    public void activate() {
        this.isActive = true;
    }

    /**
     * 회원 탈퇴 (소프트 삭제)
     */
    public void delete() {
        this.isActive = false;
        this.deletedAt = LocalDateTime.now();
    }

    /**
     * 사업자 회원으로 승급
     */
    public void upgradeToBusinessOwner() {
        if (this.role == MemberRole.BUSINESS_OWNER) {
            throw new IllegalStateException("이미 사업자 회원입니다.");
        }
        this.role = MemberRole.BUSINESS_OWNER;
    }

    // ==================== Validation ====================

    private void validateEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("이메일은 필수입니다.");
        }
        if (!email.matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new IllegalArgumentException("올바른 이메일 형식이 아닙니다.");
        }
    }

    private void validateName(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("이름은 필수입니다.");
        }
        if (name.length() > 50) {
            throw new IllegalArgumentException("이름은 50자를 초과할 수 없습니다.");
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