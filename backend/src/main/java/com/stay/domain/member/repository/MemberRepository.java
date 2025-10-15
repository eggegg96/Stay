package com.stay.domain.member.repository;

import com.stay.domain.member.entity.Member;
import com.stay.domain.member.entity.MemberGrade;
import com.stay.domain.member.entity.MemberRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * 회원 리포지토리
 *
 * Spring Data JPA 사용:
 * - 메서드 이름으로 쿼리 자동 생성
 * - 복잡한 쿼리는 @Query 사용
 * - JpaRepository<엔티티, ID타입>
 */
public interface MemberRepository extends JpaRepository<Member, Long> {

    // ==================== 기본 조회 ====================

    /**
     * 이메일로 회원 조회
     */
    Optional<Member> findByEmail(String email);

    /**
     * 전화번호로 회원 조회
     */
    Optional<Member> findByPhoneNumber(String phoneNumber);

    /**
     * 활성 회원만 조회 (이메일)
     */
    @Query("SELECT m FROM Member m WHERE m.email = :email AND m.isActive = true AND m.deletedAt IS NULL")
    Optional<Member> findActiveByEmail(@Param("email") String email);

    /**
     * 이메일 존재 여부 확인
     */
    boolean existsByEmail(String email);

    /**
     * 전화번호 존재 여부 확인
     */
    boolean existsByPhoneNumber(String phoneNumber);

    // ==================== 닉네임 관련 ====================


    Optional<Member> findByNickname(String nickname);

    boolean existsByNickname(String nickname);

    /**
     * 활성 회원 중 닉네임으로 조회
     *
     * 왜 필요한가?
     * - 탈퇴한 회원의 닉네임은 재사용 가능하도록 할 경우 사용
     * - 현재는 unique 제약이 있어서 탈퇴 회원도 닉네임 유지되지만,
     *   나중에 정책이 바뀔 수 있으므로 미리 준비
     */
    @Query("SELECT m FROM Member m WHERE m.nickname = :nickname AND m.isActive = true AND m.deletedAt IS NULL")
    Optional<Member> findActiveByNickname(@Param("nickname") String nickname);



    // ==================== 등급 관련 ====================

    /**
     * 특정 등급의 회원 목록 조회
     */
    List<Member> findByGrade(MemberGrade grade);

    /**
     * 등급 갱신 대상 회원 조회
     * - 마지막 등급 갱신일이 특정 기간 이전인 회원
     * - 배치 작업에서 사용
     */
    @Query("SELECT m FROM Member m " +
            "WHERE m.lastGradeUpdatedAt < :targetDate " +
            "AND m.isActive = true " +
            "AND m.deletedAt IS NULL")
    List<Member> findMembersForGradeUpdate(@Param("targetDate") LocalDateTime targetDate);

    // ==================== 역할 관련 ====================

    /**
     * 특정 역할의 회원 목록 조회
     */
    List<Member> findByRole(MemberRole role);

    /**
     * 사업자 회원 목록 조회
     */
    @Query("SELECT m FROM Member m " +
            "WHERE m.role = 'BUSINESS_OWNER' " +
            "AND m.isActive = true " +
            "ORDER BY m.createdAt DESC")
    List<Member> findBusinessOwners();

    // ==================== 통계 관련 ====================

    /**
     * 활성 회원 수 조회
     */
    @Query("SELECT COUNT(m) FROM Member m " +
            "WHERE m.isActive = true AND m.deletedAt IS NULL")
    long countActiveMembers();

    /**
     * 등급별 회원 수 조회
     */
    @Query("SELECT m.grade, COUNT(m) FROM Member m " +
            "WHERE m.isActive = true AND m.deletedAt IS NULL " +
            "GROUP BY m.grade")
    List<Object[]> countMembersByGrade();

    /**
     * 기간별 신규 가입자 수
     */
    @Query("SELECT COUNT(m) FROM Member m " +
            "WHERE m.createdAt BETWEEN :startDate AND :endDate")
    long countNewMembersBetween(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    // ==================== 관리자 기능 ====================

    /**
     * 키워드로 회원 검색 (이름, 이메일)
     */
    @Query("SELECT m FROM Member m " +
            "WHERE (m.name LIKE %:keyword% OR m.email LIKE %:keyword%) " +
            "AND m.deletedAt IS NULL " +
            "ORDER BY m.createdAt DESC")
    List<Member> searchMembers(@Param("keyword") String keyword);

    /**
     * 비활성 회원 목록 조회
     */
    @Query("SELECT m FROM Member m " +
            "WHERE m.isActive = false AND m.deletedAt IS NULL " +
            "ORDER BY m.updatedAt DESC")
    List<Member> findInactiveMembers();

    /**
     * 탈퇴 회원 목록 조회 (90일 이내)
     */
    @Query("SELECT m FROM Member m " +
            "WHERE m.deletedAt IS NOT NULL " +
            "AND m.deletedAt > :retentionDate " +
            "ORDER BY m.deletedAt DESC")
    List<Member> findDeletedMembersWithinRetention(
            @Param("retentionDate") LocalDateTime retentionDate
    );
}