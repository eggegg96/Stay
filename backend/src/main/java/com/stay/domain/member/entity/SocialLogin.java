package com.stay.domain.member.entity;

import com.stay.domain.common.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 소셜 로그인 정보 엔티티
 *
 * 설계 이유:
 * 1. 한 회원이 여러 소셜 계정 연동 가능 (구글, 네이버, 카카오 동시 연동)
 * 2. 소셜 로그인 관련 정보를 Member 엔티티와 분리 (단일 책임 원칙)
 * 3. 소셜 제공자별 고유 ID 관리
 */
@Entity
@Table(name = "social_logins",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_provider_social_id",
                        columnNames = {"provider", "social_id"}
                )
        },
        indexes = {
                @Index(name = "idx_member_id", columnList = "member_id"),
                @Index(name = "idx_provider_social_id", columnList = "provider, social_id")
        }
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class SocialLogin extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "social_login_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false, foreignKey = @ForeignKey(name = "fk_social_login_member"))
    private Member member;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private SocialProvider provider;

    /**
     * 소셜 제공자가 제공하는 고유 ID
     * 예: 구글 sub, 카카오 id, 네이버 id
     */
    @Column(name = "social_id", nullable = false, length = 100)
    private String socialId;

    /**
     * 소셜 제공자의 이메일
     * Member의 이메일과 다를 수 있음 (선택사항)
     */
    @Column(name = "social_email", length = 100)
    private String socialEmail;

    /**
     * 소셜 제공자의 닉네임/이름
     */
    @Column(name = "social_name", length = 100)
    private String socialName;

    /**
     * 소셜 제공자의 프로필 이미지 URL
     */
    @Column(name = "profile_image_url", length = 500)
    private String profileImageUrl;

    @Builder
    private SocialLogin(
            Member member,
            SocialProvider provider,
            String socialId,
            String socialEmail,
            String socialName,
            String profileImageUrl
    ) {
        validateMember(member);
        validateProvider(provider);
        validateSocialId(socialId);

        this.member = member;
        this.provider = provider;
        this.socialId = socialId;
        this.socialEmail = socialEmail;
        this.socialName = socialName;
        this.profileImageUrl = profileImageUrl;
    }

    // ==================== 비즈니스 로직 ====================

    /**
     * 소셜 로그인 정보 업데이트
     * - 로그인 시마다 최신 정보로 갱신
     */
    public void updateSocialInfo(String socialEmail, String socialName, String profileImageUrl) {
        this.socialEmail = socialEmail;
        this.socialName = socialName;
        this.profileImageUrl = profileImageUrl;
    }

    /**
     * 회원 연결 (소셜 계정 추가 연동 시 사용)
     */
    public void linkToMember(Member member) {
        validateMember(member);
        this.member = member;
    }

    // ==================== Validation ====================

    private void validateMember(Member member) {
        if (member == null) {
            throw new IllegalArgumentException("회원 정보는 필수입니다.");
        }
    }

    private void validateProvider(SocialProvider provider) {
        if (provider == null) {
            throw new IllegalArgumentException("소셜 제공자 정보는 필수입니다.");
        }
    }

    private void validateSocialId(String socialId) {
        if (socialId == null || socialId.trim().isEmpty()) {
            throw new IllegalArgumentException("소셜 ID는 필수입니다.");
        }
    }

    // ==================== 편의 메서드 ====================

    /**
     * 특정 소셜 제공자인지 확인
     */
    public boolean isProvider(SocialProvider provider) {
        return this.provider == provider;
    }

    /**
     * 구글 로그인 여부
     */
    public boolean isGoogle() {
        return this.provider == SocialProvider.GOOGLE;
    }

    /**
     * 네이버 로그인 여부
     */
    public boolean isNaver() {
        return this.provider == SocialProvider.NAVER;
    }

    /**
     * 카카오 로그인 여부
     */
    public boolean isKakao() {
        return this.provider == SocialProvider.KAKAO;
    }
}