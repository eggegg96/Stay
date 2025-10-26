package com.stay.domain.member.dto;

import com.stay.domain.member.entity.BusinessInfo;

/**
 * 사업자 정보 응답 DTO
 *
 * 클라이언트에게 보여줄 사업자 정보
 *
 * 사용 예시:
 * - 사업자 대시보드에서 내 정보 표시
 * - 관리자가 승인 대기 목록 조회
 */
public record BusinessInfoResponse(
        Long id,
        Long memberId,
        String businessNumber,
        String companyName,
        Boolean emailVerified,
        String bankName,
        String bankAccount,
        String accountHolder,
        String approvalStatus,
        String approvalNote
) {
    /**
     * BusinessInfo 엔티티 → DTO 변환
     */
    public static BusinessInfoResponse from(BusinessInfo businessInfo) {
        return new BusinessInfoResponse(
                businessInfo.getId(),
                businessInfo.getMember().getId(),
                businessInfo.getBusinessNumber(),
                businessInfo.getCompanyName(),
                businessInfo.getEmailVerified(),
                businessInfo.getBankName(),
                businessInfo.getBankAccount(),
                businessInfo.getAccountHolder(),
                businessInfo.getApprovalStatus().name(),
                businessInfo.getApprovalNote()
        );
    }
}