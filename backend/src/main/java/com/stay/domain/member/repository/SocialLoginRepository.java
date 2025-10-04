package com.stay.domain.member.repository;

import com.stay.domain.member.entity.Member;
import com.stay.domain.member.entity.SocialLogin;
import com.stay.domain.member.entity.SocialProvider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

/**
 * 소셜 로그인 리포지토리
 */
public interface SocialLoginRepository extends JpaRepository<SocialLogin, Long> {

    /**
     * 소셜 제공자와 소셜 ID로 조회
     */
    Optional<SocialLogin> findByProviderAndSocialId(
            SocialProvider provider,
            String socialId
    );

    /**
     * 소셜 제공자와 소셜 ID로 조회 (회원 정보 포함)
     * - N+1 문제 방지를 위한 fetch join
     */
    @Query("SELECT sl FROM SocialLogin sl " +
            "JOIN FETCH sl.member m " +
            "WHERE sl.provider = :provider AND sl.socialId = :socialId")
    Optional<SocialLogin> findByProviderAndSocialIdWithMember(
            @Param("provider") SocialProvider provider,
            @Param("socialId") String socialId
    );

    /**
     * 회원의 모든 소셜 로그인 정보 조회
     */
    List<SocialLogin> findByMember(Member member);

    /**
     * 회원의 특정 소셜 제공자 로그인 정보 조회
     */
    Optional<SocialLogin> findByMemberAndProvider(Member member, SocialProvider provider);

    /**
     * 소셜 제공자와 소셜 ID 존재 여부 확인
     */
    boolean existsByProviderAndSocialId(SocialProvider provider, String socialId);

    /**
     * 회원의 특정 소셜 제공자 연동 여부 확인
     */
    boolean existsByMemberAndProvider(Member member, SocialProvider provider);

    /**
     * 소셜 로그인 정보 삭제 (회원 탈퇴 시 사용)
     */
    void deleteByMember(Member member);
}