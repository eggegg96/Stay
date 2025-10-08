package com.stay.domain.auth.dto;

/**
 * 네이버 사용자 정보 응답 DTO
 *
 * 네이버는 response로 한번 감싸져 있음:
 * {
 *   "resultcode": "00",
 *   "message": "success",
 *   "response": {
 *     "id": "123456",
 *     "email": "user@naver.com",
 *     "name": "홍길동",
 *     "profile_image": "https://..."
 *   }
 * }
 */
public record NaverUserInfoResponse(
        String resultcode,
        String message,
        NaverUserInfo response
) {}