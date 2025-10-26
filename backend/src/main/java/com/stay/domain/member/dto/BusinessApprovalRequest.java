package com.stay.domain.member.dto;

/**
 * 사업자 승인/거부 요청 DTO
 *
 * 관리자가 사업자 승인/거부 처리 시 사용
 *
 * @param note 승인/거부 메모
 */
public record BusinessApprovalRequest(
        String note
) {
}