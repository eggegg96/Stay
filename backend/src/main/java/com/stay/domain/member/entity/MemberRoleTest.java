package com.stay.domain.member.entity;

public class MemberRoleTest {

    public static void main(String[] args) {
        // Lombok @Getter 테스트
        MemberRole role = MemberRole.CUSTOMER;

        System.out.println("역할: " + role);
        System.out.println("설명: " + role.getDescription()); // Lombok이 만든 getter
        System.out.println("레벨: " + role.getLevel()); // Lombok이 만든 getter

        // 메서드 테스트
        System.out.println("관리자인가? " + role.isAdminOrHigher());
    }
}
