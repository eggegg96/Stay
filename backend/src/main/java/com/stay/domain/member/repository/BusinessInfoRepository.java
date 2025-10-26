package com.stay.domain.member.repository;

import com.stay.domain.member.entity.BusinessInfo;
import com.stay.domain.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

/**
 * 사업자 정보 Repository
 *
 * 주요 기능:
 * - 사업자 등록번호로 조회/중복 체크
 * - Member와 연결된 사업자 정보 조회
 * - 승인 상태별 필터링
 */
public interface BusinessInfoRepository extends JpaRepository<BusinessInfo, Long> {

    // ==================== 기본 조회 ====================

    /**
     * 사업자 등록번호로 조회
     *
     * 사용 예시:
     * - 회원가입 시 사업자 등록번호 중복 체크
     * - 사업자 정보 수정 시 본인 확인
     */
    Optional<BusinessInfo> findByBusinessNumber(String businessNumber);

    /**
     * 사업자 등록번호 중복 체크
     *
     * 사용 예시:
     * - 회원가입 시 "이미 등록된 사업자 등록번호입니다" 검증
     */
    boolean existsByBusinessNumber(String businessNumber);

    /**
     * Member ID로 사업자 정보 조회
     *
     * 사용 예시:
     * - 로그인한 사업자의 정보 조회
     * - 사업자 대시보드에서 내 정보 불러오기
     */
    Optional<BusinessInfo> findByMemberId(Long memberId);

    // ==================== 승인 관련 ====================

    /**
     * 승인 상태별 사업자 목록 조회
     *
     * 사용 예시:
     * - 관리자 페이지에서 승인 대기 목록 보기
     * - 승인 완료된 사업자만 필터링
     */
    List<BusinessInfo> findByApprovalStatus(BusinessInfo.ApprovalStatus approvalStatus);

    /**
     * 승인 상태별 사업자 수 카운트
     *
     * 사용 예시:
     * - 관리자 대시보드에 "승인 대기 3건" 표시
     * - 통계: "이번 달 승인된 사업자 10명"
     */
    long countByApprovalStatus(BusinessInfo.ApprovalStatus approvalStatus);
}