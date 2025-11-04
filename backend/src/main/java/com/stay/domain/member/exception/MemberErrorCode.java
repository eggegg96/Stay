package com.stay.domain.member.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * 회원 도메인 에러 코드
 *
 * 에러 코드 체계:
 * - MEMBER_001~099: 회원 조회 관련
 * - MEMBER_101~199: 회원 가입 관련
 * - MEMBER_201~299: 회원 정보 수정 관련
 * - MEMBER_301~399: 포인트 관련
 * - MEMBER_401~499: 권한 관련
 * - MEMBER_501~599: 소셜 로그인 관련
 * - MEMBER_601~699: Validation 관련
 * - MEMBER_701~799: 사업자 관련 ← 새로 추가!
 * - MEMBER_801~899: 이메일 관련
 */
@Getter
@RequiredArgsConstructor
public enum MemberErrorCode {

    // 회원 조회 관련 (001~099)
    MEMBER_NOT_FOUND("MEMBER_001", "회원을 찾을 수 없습니다."),
    MEMBER_NOT_ACTIVE("MEMBER_002", "비활성화된 회원입니다."),
    MEMBER_DELETED("MEMBER_003", "탈퇴한 회원입니다."),
    MEMBER_DELETED_RECENTLY("MEMBER_004", "탈퇴 후 24시간 이내에는 재가입할 수 없습니다."),
    MEMBER_NOT_DELETED("MEMBER_005", "탈퇴하지 않은 회원입니다."),

    // 회원 가입 관련 (101~199)
    DUPLICATE_EMAIL("MEMBER_101", "이미 가입된 이메일입니다."),
    DUPLICATE_PHONE("MEMBER_102", "이미 가입된 전화번호입니다."),
    DUPLICATE_SOCIAL_LOGIN("MEMBER_103", "이미 연동된 소셜 계정입니다."),
    DUPLICATE_NICKNAME("MEMBER_104", "이미 사용 중인 닉네임입니다."),

    // 회원 정보 수정 관련 (201~299)
    INVALID_EMAIL_FORMAT("MEMBER_201", "올바른 이메일 형식이 아닙니다."),
    INVALID_PHONE_FORMAT("MEMBER_202", "올바른 전화번호 형식이 아닙니다."),
    INVALID_NAME_LENGTH("MEMBER_203", "이름은 1-50자 사이여야 합니다."),

    // 포인트 관련 (301~399)
    INSUFFICIENT_POINTS("MEMBER_301", "포인트가 부족합니다."),
    INVALID_POINT_AMOUNT("MEMBER_302", "포인트는 0 이상이어야 합니다."),

    // 권한 관련 (401~499)
    FORBIDDEN_ROLE_CHANGE("MEMBER_401", "권한 변경이 불가능합니다."),
    ALREADY_BUSINESS_OWNER("MEMBER_402", "이미 사업자 회원입니다."),
    UNAUTHORIZED_ACCESS("MEMBER_403", "접근 권한이 없습니다."),

    // 소셜 로그인 관련 (501~599)
    SOCIAL_LOGIN_NOT_FOUND("MEMBER_501", "소셜 로그인 정보를 찾을 수 없습니다."),
    UNSUPPORTED_SOCIAL_PROVIDER("MEMBER_502", "지원하지 않는 소셜 제공자입니다."),
    SOCIAL_LOGIN_ALREADY_LINKED("MEMBER_503", "이미 다른 회원과 연동된 소셜 계정입니다."),

    // Validation 관련 (601~699)
    INVALID_INPUT_VALUE("MEMBER_601", "잘못된 입력값입니다."),

    // Member Validation
    MEMBER_EMAIL_REQUIRED("MEMBER_611", "이메일은 필수입니다."),
    MEMBER_EMAIL_INVALID_FORMAT("MEMBER_612", "올바른 이메일 형식이 아닙니다."),
    MEMBER_NAME_REQUIRED("MEMBER_613", "이름은 필수입니다."),
    MEMBER_NAME_TOO_LONG("MEMBER_614", "이름은 50자를 초과할 수 없습니다."),
    MEMBER_NICKNAME_REQUIRED("MEMBER_615", "닉네임은 필수입니다."),
    MEMBER_NICKNAME_INVALID_LENGTH("MEMBER_616", "닉네임은 2~30자여야 합니다."),
    MEMBER_NICKNAME_INVALID_FORMAT("MEMBER_617", "닉네임은 한글, 영문, 숫자만 입력 가능합니다."),

    // SocialLogin Validation
    SOCIAL_MEMBER_REQUIRED("MEMBER_621", "회원 정보는 필수입니다."),
    SOCIAL_PROVIDER_REQUIRED("MEMBER_622", "소셜 제공자 정보는 필수입니다."),
    SOCIAL_ID_REQUIRED("MEMBER_623", "소셜 ID는 필수입니다."),

    // ==================== 사업자 관련 (701~799) ====================

    // 사업자 기본 (701~710)
    BUSINESS_INFO_NOT_FOUND("MEMBER_701", "사업자 정보를 찾을 수 없습니다."),
    DUPLICATE_BUSINESS_NUMBER("MEMBER_702", "이미 등록된 사업자 등록번호입니다."),
    NOT_BUSINESS_OWNER("MEMBER_703", "사업자 회원이 아닙니다."),

    // 사업자 등록번호 검증 (711~720)
    BUSINESS_NUMBER_REQUIRED("MEMBER_711", "사업자 등록번호는 필수입니다."),
    BUSINESS_NUMBER_INVALID_FORMAT("MEMBER_712", "사업자 등록번호 형식이 올바르지 않습니다 (XXX-XX-XXXXX)."),

    // 회사 정보 검증 (721~730)
    COMPANY_NAME_REQUIRED("MEMBER_721", "회사명은 필수입니다."),

    // 정산 계좌 검증 (731~740)
    BANK_NAME_REQUIRED("MEMBER_731", "은행명은 필수입니다."),
    BANK_ACCOUNT_REQUIRED("MEMBER_732", "계좌번호는 필수입니다."),
    ACCOUNT_HOLDER_REQUIRED("MEMBER_733", "예금주명은 필수입니다."),

    // 이메일 인증 (741~750)
    EMAIL_NOT_VERIFIED("MEMBER_741", "이메일 인증이 완료되지 않았습니다."),

    // 사업자 포인트 제한 (751~760) 추후 다른 Error 코드로 변경 가능
    BUSINESS_MEMBER_CANNOT_EARN_POINTS("MEMBER_751", "사업자 회원은 포인트를 적립할 수 없습니다."),
    BUSINESS_MEMBER_CANNOT_USE_POINTS("MEMBER_752", "사업자 회원은 포인트를 사용할 수 없습니다."),

    // 승인 상태 관련 (761~770)
    BUSINESS_NOT_APPROVED("MEMBER_761", "승인되지 않은 사업자입니다."),
    BUSINESS_ALREADY_APPROVED("MEMBER_762", "이미 승인된 사업자입니다."),
    BUSINESS_REJECTED("MEMBER_763", "승인이 거부된 사업자입니다."),
    REJECTION_REASON_REQUIRED("MEMBER_764", "승인 거부 사유는 필수입니다."),

    // 기타 사업자 (771~799)
    MEMBER_REQUIRED("MEMBER_771", "회원 정보가 필요합니다."),
    CANNOT_CHANGE_ADMIN_ROLE("MEMBER_772", "관리자 역할은 변경할 수 없습니다."),

    // 이메일 인증 관련 (801~899)
    ALREADY_VERIFIED("MEMBER_801", "이미 이메일 인증이 완료된 회원입니다."),
    INVALID_VERIFICATION_TOKEN("MEMBER_802", "유효하지 않은 인증 토큰입니다."),
    VERIFICATION_TOKEN_EXPIRED("MEMBER_803", "인증 토큰이 만료되었습니다."),
    VERIFICATION_TOKEN_ALREADY_USED("MEMBER_804", "이미 사용된 인증 토큰입니다."),
    EMAIL_RESEND_TOO_SOON("MEMBER_805", "인증 메일은 3분 후에 재발송할 수 있습니다."),
    EMAIL_SEND_FAILED("MEMBER_806", "이메일 발송에 실패했습니다."),
    VERIFICATION_TOKEN_NOT_FOUND("MEMBER_807", "인증 토큰을 찾을 수 없습니다."),
    EMAIL_VERIFICATION_REQUIRED("MEMBER_808", "이메일 인증이 필요합니다."),

    // 기타 (999)
    INTERNAL_ERROR("MEMBER_999", "회원 처리 중 오류가 발생했습니다.");

    private final String code;
    private final String message;
}