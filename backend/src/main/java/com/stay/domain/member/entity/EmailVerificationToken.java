package com.stay.domain.member.entity;

import com.stay.domain.common.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 이메일 인증 토큰 엔티티
 *
 * 역할:
 * - 회원가입 시 이메일 인증용 토큰 저장
 * - 토큰 만료 시간 관리
 * - 인증 완료 여부 추적
 */
@Entity
@Table(name = "email_verification_tokens",
        indexes = {
                @Index(name = "idx_token", columnList = "token"),
                @Index(name = "idx_member_id", columnList = "member_id")
        })
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class EmailVerificationToken extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "token_id")
    private Long id;

    /**
     * 인증 대상 회원
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    /**
     * 인증 토큰 (UUID)
     */
    @Column(name = "token", nullable = false, unique = true, length = 100)
    private String token;

    /**
     * 인증할 이메일 주소
     */
    @Column(name = "email", nullable = false, length = 100)
    private String email;

    /**
     * 토큰 만료 시간 (기본: 24시간)
     */
    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    /**
     * 인증 완료 여부
     */
    @Column(name = "verified", nullable = false)
    private boolean verified = false;

    /**
     * 인증 완료 시간
     */
    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;

    // ==================== 생성자 ====================

    @Builder
    public EmailVerificationToken(
            Member member,
            String token,
            String email,
            LocalDateTime expiresAt
    ) {
        this.member = member;
        this.token = token;
        this.email = email;
        this.expiresAt = expiresAt;
        this.verified = false;
    }

    // ==================== 비즈니스 로직 ====================

    /**
     * 토큰 만료 여부 확인
     */
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiresAt);
    }

    /**
     * 토큰 사용 가능 여부 확인
     */
    public boolean isUsable() {
        return !verified && !isExpired();
    }

    /**
     * 토큰 인증 처리
     */
    public void verify() {
        if (!isUsable()) {
            throw new IllegalStateException(
                    "사용할 수 없는 토큰입니다. (이미 사용됨 또는 만료됨)"
            );
        }

        this.verified = true;
        this.verifiedAt = LocalDateTime.now();
    }

    /**
     * 토큰 만료 시간 연장
     */
    public void extendExpiration(int hours) {
        this.expiresAt = LocalDateTime.now().plusHours(hours);
    }
}