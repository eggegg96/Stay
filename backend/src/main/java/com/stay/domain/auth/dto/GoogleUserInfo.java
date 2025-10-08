package com.stay.domain.auth.dto;

/**
 * 구글 사용자 정보 DTO
 *
 * 구글 API 응답 예시:
 * {
 *   "id": "123456789",
 *   "email": "user@gmail.com",
 *   "name": "홍길동",
 *   "picture": "https://..."
 * }
 */
public record GoogleUserInfo(
        String id,
        String email,
        String name,
        String picture
) {}