package com.stay.domain.member.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * 닉네임 변경 요청 DTO
 *
 * 왜 record를 사용하나?
 * - Java 16부터 지원되는 불변 데이터 클래스
 * - getter, equals, hashCode, toString 자동 생성
 * - 간결하고 안전한 DTO 작성 가능
 *
 * 왜 Validation 어노테이션을 사용하나?
 * - Controller에 들어오기 전에 입력값 검증
 * - Service 계층에서 추가 검증 필요 없음 (중복 체크는 Service에서)
 * - 일관된 에러 메시지 제공
 * - Spring의 @Valid와 함께 사용하면 자동으로 검증됨
 */
public record UpdateNicknameRequest(

        @NotBlank(message = "닉네임은 필수입니다.")
        @Size(min = 2, max = 30, message = "닉네임은 2-30자 사이여야 합니다.")
        @Pattern(
                regexp = "^[가-힣a-zA-Z0-9]+$",
                message = "닉네임은 한글, 영문, 숫자만 입력 가능합니다"
        )
        String nickname
) {
    /**
     * 정적 팩토리 메서드
     *
     * 왜 필요한가?
     * - 생성 의도를 명확히 표현
     * - 테스트 코드 작성 시 가독성 향상
     */
    public static UpdateNicknameRequest of(String nickname) {
        return new UpdateNicknameRequest(nickname);
    }
}