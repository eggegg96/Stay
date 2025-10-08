package com.stay.domain.auth.dto;

/**
 * 카카오 사용자 정보 DTO
 *
 * 카카오는 구조가 복잡함:
 * {
 *   "id": 123456789,
 *   "kakao_account": {
 *     "email": "user@kakao.com",
 *     "profile": {
 *       "nickname": "홍길동",
 *       "profile_image_url": "https://..."
 *     }
 *   }
 * }
 */
public record KakaoUserInfo(
        Long id,
        KakaoAccount kakao_account
) {}