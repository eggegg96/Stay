package com.stay.domain.member.dto;

import com.stay.domain.member.entity.Member;

/**
 * 회원 정보 응답 DTO
 *
 * 왜 DTO를 사용하나?
 * - 엔티티를 직접 반환하면 순환참조 문제 발생 가능
 * - 민감한 정보 노출 방지 (비밀번호, 삭제 여부 등)
 * - 필요한 정보만 선택적으로 응답
 * - API 응답 구조를 명확히 정의
 *
 * 엔티티 vs DTO:
 * - 엔티티: DB 테이블과 매핑되는 도메인 모델
 * - DTO: API 통신용 데이터 전송 객체
 * - 두 개를 분리해야 도메인 로직과 API 스펙이 독립적으로 변경 가능
 *
 * 사용 예시:
 * ```json
 * {
 *   "id": 1,
 *   "email": "user@example.com",
 *   "nickname": "멋진닉네임",
 *   "name": "홍길동",
 *   "points": 1000,
 *   "grade": "BASIC",
 *   "role": "CUSTOMER"
 * }
 * ```
 */
public record MemberResponse(
        Long id,
        String email,
        String nickname,
        String name,
        Integer points,
        String grade,
        String role
) {
    /**
     * Member 엔티티 → DTO 변환
     *
     * 왜 정적 팩토리 메서드를 사용하나?
     * - 변환 로직을 DTO에 캡슐화
     * - Controller나 Service에서 변환 코드 중복 방지
     * - 메서드 이름으로 의도를 명확히 표현
     */
    public static MemberResponse from(Member member) {
        return new MemberResponse(
                member.getId(),
                member.getEmail(),
                member.getNickname(),
                member.getName(),
                member.getPoints(),
                member.getGrade().name(),
                member.getRole().name()
        );
    }

    /**
     * 닉네임이 없는 경우 기본값 처리
     *
     * 왜 필요한가?
     * - 소셜 로그인 직후에는 닉네임이 없을 수 있음
     * - null 대신 "닉네임 미설정" 같은 기본값 제공
     */
}