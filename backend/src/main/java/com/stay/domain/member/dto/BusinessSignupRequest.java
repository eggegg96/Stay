package com.stay.domain.member.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * 사업자 회원가입 요청 DTO
 *
 * 왜 DTO를 따로 만드나?
 * - 클라이언트로부터 받는 데이터를 검증
 * - 엔티티와 API 스펙을 분리
 * - 필요한 필드만 받음 (보안)
 *
 * @param email 이메일
 * @param password 비밀번호
 * @param name 이름
 * @param phoneNumber 전화번호
 * @param businessNumber 사업자 등록번호 (XXX-XX-XXXXX)
 * @param companyName 회사명
 */
public record BusinessSignupRequest(

        // TODO: 이메일 검증
        // 힌트: @NotBlank, @Email 애노테이션 사용
        @NotBlank(message = "이메일은 필수입니다.")
        @Email(message = "올바른 이메일 형식이 아닙니다.")
        String email,

        // TODO: 비밀번호 검증 (8~20자)
        // 힌트: @NotBlank, @Size(min=8, max=20)
        @NotBlank(message = "비밀번호는 필수입니다.")
        @Size(min=8, max=20, message = "비밀번호는 8~20자여야 합니다.")
        String password,

        // TODO: 이름 검증 (2~50자)
        @NotBlank(message = "이름은 필수입니다.")
        @Size(min=2, max=50, message = "이름은 2~50자여야 합니다.")
        String name,

        // TODO: 전화번호 검증 (선택사항이므로 @NotBlank 불필요)
        @Pattern(regexp = "^01[0-9]-\\d{4}-\\d{4}$",
                message = "전화번호 형식이 올바르지 않습니다 (010-1234-5678)")
        String phoneNumber,

        // TODO: 사업자 등록번호 검증 (XXX-XX-XXXXX 형식)
        @NotBlank(message = "사업자 등록번호는 필수입니다")
        @Pattern(regexp = "^\\d{3}-\\d{2}-\\d{5}$",
                message = "사업자 등록번호 형식이 올바르지 않습니다 (123-45-67890)")
        String businessNumber,

        // TODO: 회사명 검증 (2~100자)
        @NotBlank(message = "회사명은 필수입니다.")
        @Size(min = 2, max = 100, message = "회사명은 2~100자여야 합니다.")
        String companyName
) {
}