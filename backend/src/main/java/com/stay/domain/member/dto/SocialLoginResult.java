package com.stay.domain.member.dto;

import com.stay.domain.member.entity.Member;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 소셜 로그인 결과
 *
 * 왜 필요한가?
 * - Member만 반환하면 신규 회원인지 기존 회원인지 구분 불가
 * - isNewMember 플래그를 함께 반환해서 Controller에서 적절히 처리
 *
 * 사용 위치:
 * - MemberService.socialLogin() 반환값
 * - AuthService.oauthLogin()에서 사용
 */
@Getter
@AllArgsConstructor
public class SocialLoginResult {
    private Member member;
    private boolean isNewMember;
}