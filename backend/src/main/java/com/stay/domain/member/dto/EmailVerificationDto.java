package com.stay.domain.member.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 이메일 인증 관련 DTO
 */
public class EmailVerificationDto {

    /**
     * 인증 메일 재발송 요청 DTO
     */
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ResendRequest {
        private String email;
    }

    /**
     * 이메일 인증 처리 응답 DTO
     */
    @Getter
    @AllArgsConstructor
    public static class VerifyResponse {
        private boolean success;
        private String message;

        public static VerifyResponse success()
        { return new VerifyResponse(true, "이메일 인증이 완료되었습니다.");}

        public static VerifyResponse failure(String message) {
            return new VerifyResponse(false, message);
        }
    }

    /**
     * 인증 메일 발송 응답 DTO
     */
    @Getter
    @AllArgsConstructor
    public static class SendResponse {
        private boolean success;
        private String message;
        private String email;

        public static SendResponse success(String email) {
            return new SendResponse(
                    true, "인증 메일이 발송되었습니다. 이메일을 확인해주세요.", email);
        }
        public static SendResponse failure(String email, String errorMessage) {
            return new SendResponse(false, "이메일 발송에 실패했습니다: " + errorMessage, email);
        }
        public static SendResponse alreadyVerified(String email) {
            return new SendResponse(false, "이미 인증이 완료된 이메일입니다.", email);
        }
    }
}