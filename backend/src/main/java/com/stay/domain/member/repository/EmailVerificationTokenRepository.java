package com.stay.domain.member.repository;

import com.stay.domain.member.entity.EmailVerificationToken;
import com.stay.domain.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * 이메일 인증 토큰 Repository
 */
public interface EmailVerificationTokenRepository extends JpaRepository<EmailVerificationToken, Long> {

    /**
     * 토큰으로 조회
     */
    Optional<EmailVerificationToken> findByToken(String token);

    /**
     * 회원으로 조회 (최신순)
     */
    List<EmailVerificationToken> findByMemberOrderByCreatedAtDesc(Member member);

    /**
     * 회원의 가장 최근 토큰 조회
     */
    @Query("SELECT t FROM EmailVerificationToken t " +
            "WHERE t.member.id = :memberId " +
            "ORDER BY t.createdAt DESC " +
            "LIMIT 1")
    Optional<EmailVerificationToken> findLatestByMemberId(@Param("memberId") Long memberId);

    /**
     * 미인증 토큰 조회
     */
    List<EmailVerificationToken> findByMemberAndVerifiedFalse(Member member);

    /**
     * 만료되지 않은 유효한 토큰 조회
     */
    @Query("SELECT t FROM EmailVerificationToken t " +
            "WHERE t.member = :member " +
            "AND t.verified = false " +
            "AND t.expiresAt > :now")
    List<EmailVerificationToken> findValidTokensByMember(
            @Param("member") Member member,
            @Param("now") LocalDateTime now
    );

    /**
     * 만료된 토큰 삭제
     */
    @Modifying
    @Query("DELETE FROM EmailVerificationToken t WHERE t.expiresAt < :now")
    int deleteExpiredTokens(@Param("now") LocalDateTime now);

    /**
     * 이미 인증된 토큰 삭제
     */
    @Modifying
    @Query("DELETE FROM EmailVerificationToken t WHERE t.member = :member AND t.verified = true")
    int deleteVerifiedTokensByMember(@Param("member") Member member);

    /**
     * 미인증 회원 수 카운트
     */
    @Query("SELECT COUNT(DISTINCT t.member.id) FROM EmailVerificationToken t " +
            "WHERE t.verified = false " +
            "AND t.expiresAt > :now")
    long countUnverifiedMembers(@Param("now") LocalDateTime now);
}