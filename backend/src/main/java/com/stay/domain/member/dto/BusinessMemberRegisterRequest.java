package com.stay.domain.member.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 사업자 회원가입 요청 DTO
 *
 * 왜 필요한가?
 * - 프론트엔드에서 보내는 데이터를 받기 위한 객체
 * - @Valid를 사용한 입력 검증
 * - 엔티티와 컨트롤러 계층 분리 (클린 아키텍처)
 *
 * 프론트엔드 요청 예시:
 * {
 *   "email": "business@example.com",
 *   "password": "password123!",
 *   "name": "홍길동",
 *   "phoneNumber": "010-1234-5678",
 *   "businessNumber": "123-45-67890",
 *   "companyName": "주식회사 스테이"
 * }
 *
 * 검증 규칙:
 * - 이메일: 이메일 형식
 * - 비밀번호: 8~20자, 영문+숫자 포함 (정규식)
 * - 이름: 2~20자
 * - 전화번호: 010-XXXX-XXXX 형식
 * - 사업자 등록번호: XXX-XX-XXXXX 형식
 * - 회사명: 2~100자
 */
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BusinessMemberRegisterRequest {

    /**
     * 이메일
     * - 이메일 형식 검증
     * - 필수 입력
     */
    @NotBlank(message = "이메일은 필수 입력입니다")
    @Email(message = "올바른 이메일 형식이 아닙니다")
    private String email;

    /**
     * 비밀번호
     * - 8~20자
     * - 영문, 숫자 포함 필수
     *
     * 정규식 설명:
     * ^                : 시작
     * (?=.*[A-Za-z])   : 영문 1개 이상
     * (?=.*\d)         : 숫자 1개 이상
     * [A-Za-z\d@$!%*#?&] : 허용 문자 (영문, 숫자, 특수문자)
     * {8,20}           : 8~20자
     * $                : 끝
     */
    @NotBlank(message = "비밀번호는 필수 입력입니다")
    @Pattern(
            regexp = "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d@$!%*#?&]{8,20}$",
            message = "비밀번호는 8~20자의 영문, 숫자를 포함해야 합니다"
    )
    private String password;

    /**
     * 이름 (실명)
     * - 2~20자
     * - 필수 입력
     */
    @NotBlank(message = "이름은 필수 입력입니다")
    @Size(min = 2, max = 20, message = "이름은 2~20자이어야 합니다")
    private String name;

    /**
     * 전화번호
     * - 010-XXXX-XXXX 형식
     * - 하이픈 포함
     *
     * 정규식 설명:
     * ^010          : 010으로 시작
     * -             : 하이픈
     * \d{4}         : 숫자 4자리
     * -             : 하이픈
     * \d{4}         : 숫자 4자리
     * $             : 끝
     */
    @NotBlank(message = "전화번호는 필수 입력입니다")
    @Pattern(
            regexp = "^010-\\d{4}-\\d{4}$",
            message = "전화번호는 010-XXXX-XXXX 형식이어야 합니다"
    )
    private String phoneNumber;

    /**
     * 사업자 등록번호
     * - XXX-XX-XXXXX 형식 (10자리)
     * - 하이픈 포함
     * - 필수 입력
     *
     * 정규식 설명:
     * ^\d{3}        : 숫자 3자리로 시작
     * -             : 하이픈
     * \d{2}         : 숫자 2자리
     * -             : 하이픈
     * \d{5}         : 숫자 5자리
     * $             : 끝
     */
    @NotBlank(message = "사업자 등록번호는 필수 입력입니다")
    @Pattern(
            regexp = "^\\d{3}-\\d{2}-\\d{5}$",
            message = "사업자 등록번호는 XXX-XX-XXXXX 형식이어야 합니다"
    )
    private String businessNumber;

    /**
     * 회사명/사업장명
     * - 2~100자
     * - 필수 입력
     */
    @NotBlank(message = "회사명은 필수 입력입니다")
    @Size(min = 2, max = 100, message = "회사명은 2~100자이어야 합니다")
    private String companyName;
}