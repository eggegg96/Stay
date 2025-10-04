package com.stay.domain.member.exception;

/**
 * 회원 도메인 예외
 *
 * RuntimeException을 상속하는 이유:
 * 1. Unchecked Exception - throws 선언 불필요
 * 2. 트랜잭션 자동 롤백 (Spring 기본 동작)
 * 3. 비즈니스 예외는 복구 불가능한 경우가 많음
 */
public class MemberException extends RuntimeException {

    private final MemberErrorCode errorCode;

    /**
     * 에러 코드로 예외 생성
     */
    public MemberException(MemberErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }

    /**
     * 에러 코드 + 커스텀 메시지로 예외 생성
     */
    public MemberException(MemberErrorCode errorCode, String customMessage) {
        super(customMessage);
        this.errorCode = errorCode;
    }

    /**
     * 에러 코드 + 원인 예외로 예외 생성
     */
    public MemberException(MemberErrorCode errorCode, Throwable cause) {
        super(errorCode.getMessage(), cause);
        this.errorCode = errorCode;
    }

    /**
     * 에러 코드 조회
     */
    public MemberErrorCode getErrorCode() {
        return errorCode;
    }

    /**
     * 에러 코드 문자열 조회
     */
    public String getCode() {
        return errorCode.getCode();
    }
}