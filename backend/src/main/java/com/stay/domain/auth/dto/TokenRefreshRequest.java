package com.stay.domain.auth.dto;

/**
 * 토큰 재발급 요청 DTO
 *
 * 왜 필요한가?
 * - Access Token이 만료되면 Refresh Token으로 새로 발급받아야 함
 * - 프론트엔드가 보내는 Refresh Token을 받기 위한 DTO
 *
 * Record를 사용한 이유:
 * - 불변 객체 (한번 생성하면 변경 불가)
 * - 간결한 코드 (생성자, getter 자동 생성)
 * - DTO는 데이터 전달만 하므로 Record가 적합
 */
public record TokenRefreshRequest(
        String refreshToken
) {
}