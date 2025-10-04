package com.stay.domain.member.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * 회원 역할 Enum
 * - CUSTOMER: 일반 회원
 * - BUSINESS_OWNER: 사업자 회원
 * - ADMIN: 관리자
 */
@Getter
@RequiredArgsConstructor
public enum MemberRole {

    CUSTOMER("일반 회원", 1),
    BUSINESS_OWNER("사업자 회원", 2),
    ADMIN("관리자", 3);

    private final String description;
    private final int level;

    /**
     * 권한 레벨 비교
     */
    public boolean hasHigherAuthorityThan(MemberRole targetRole) {
        return this.level > targetRole.level;
    }

    /**
     * 관리자 이상 권한 체크
     */
    public boolean isAdminOrHigher() {
        return this.level >= ADMIN.level;
    }

    /**
     * 사업자 이상 권한 체크
     */
    public boolean isBusinessOwnerOrHigher() {
        return this.level >= BUSINESS_OWNER.level;
    }
}