package com.stay.domain.member.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * 정산 계좌 등록 요청 DTO
 *
 * @param bankName 은행명
 * @param bankAccount 계좌번호
 * @param accountHolder 예금주
 */
public record UpdateBankAccountRequest(

        // TODO: 은행명 검증 (필수, 최대 50자)
        @NotBlank(message = "은행명은 필수입니다.")
        @Size(max = 50)
        String bankName,

        // TODO: 계좌번호 검증 (필수, 최대 50자)
        @NotBlank(message = "계좌번호는 필수입니다.")
        @Size(max = 50, message = "계좌번호는 최대 50자여야 합니다.")
        String bankAccount,

        // TODO: 예금주 검증 (필수, 최대 50자)
        @NotBlank(message = "예금주는 필수입니다.")
        @Size(max=50, message = "예금주명은 최대 50자여야 합니다.")
        String accountHolder
) {
}