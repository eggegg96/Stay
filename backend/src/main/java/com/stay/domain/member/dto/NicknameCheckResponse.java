package com.stay.domain.member.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * 닉네임 중복 체크 응답 DTO
 */
@Getter
@RequiredArgsConstructor
public class NicknameCheckResponse {

    private final boolean available;  // true: 사용 가능, false: 중복
    private final String message;     // 사용자에게 보여줄 메시지

    /**
     * 사용 가능한 경우 응답 생성
     */
    public static NicknameCheckResponse available() {
        return new NicknameCheckResponse(true, "사용 가능한 닉네임입니다.");
    }

    /**
     * 중복인 경우 응답 생성
     */
    public static NicknameCheckResponse duplicate() {
        return new NicknameCheckResponse(false, "이미 사용 중인 닉네임입니다.");
    }

    /**
     * 커스텀 메시지로 응답 생성
     */
    public static NicknameCheckResponse of(boolean available, String message) {
        return new NicknameCheckResponse(available, message);
    }
}