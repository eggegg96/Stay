package com.stay.domain.member.controller;

import com.stay.domain.member.entity.Member;
import com.stay.domain.member.service.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * 회원 API 컨트롤러
 *
 * 역할:
 * - 인증된 사용자의 회원 정보 관리
 * - 모든 엔드포인트는 JWT 인증 필수
 * - @AuthenticationPrincipal로 현재 로그인한 사용자 정보 접근
 *
 * 보안:
 * - SecurityConfig에서 /api/members/** 는 authenticated() 설정
 * - JWT 토큰이 없거나 유효하지 않으면 401 Unauthorized
 * - 본인의 정보만 조회/수정 가능
 */
@Slf4j
@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    /**
     * 내 정보 조회
     * GET /api/members/me
     *
     * @param memberId JWT에서 추출한 현재 로그인한 사용자의 ID
     * @return 회원 정보
     *
     * 테스트:
     * curl -H "Authorization: Bearer {token}" http://localhost:8080/api/members/me
     */
    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getMyInfo(
            @AuthenticationPrincipal Long memberId
    ) {
        log.info("========================================");
        log.info("내 정보 조회 요청 - memberId: {}", memberId);

        // 활성 회원만 조회 (탈퇴/비활성 회원 차단)
        Member member = memberService.findActiveById(memberId);

        Map<String, Object> response = new HashMap<>();
        response.put("id", member.getId());
        response.put("email", member.getEmail());
        response.put("name", member.getName());
        response.put("nickname", member.getNickname());
        response.put("phoneNumber", member.getPhoneNumber());
        response.put("role", member.getRole().name());
        response.put("grade", member.getGrade().name());
        response.put("points", member.getPoints());
        response.put("reservationCount", member.getReservationCount());
        response.put("profileImageUrl", member.getProfileImageUrl());
        response.put("isActive", member.getIsActive());

        log.info("회원 정보 - nickname: {}, grade: {}", member.getNickname(), member.getGrade());
        log.info("========================================");

        return ResponseEntity.ok(response);
    }

    /**
     * 내 포인트 조회
     * GET /api/members/me/points
     *
     * @param memberId 현재 로그인한 사용자 ID
     * @return 포인트 정보
     */
    @GetMapping("/me/points")
    public ResponseEntity<Map<String, Object>> getMyPoints(
            @AuthenticationPrincipal Long memberId
    ) {
        log.info("내 포인트 조회 요청 - memberId: {}", memberId);

        Member member = memberService.findActiveById(memberId);

        Map<String, Object> response = new HashMap<>();
        response.put("points", member.getPoints());
        response.put("grade", member.getGrade().name());
        response.put("gradeDescription", getGradeDescription(member.getGrade().name()));

        return ResponseEntity.ok(response);
    }

    /**
     * 사업자 회원 승급 신청
     * POST /api/members/upgrade
     *
     * 일반 회원(CUSTOMER) → 사업자 회원(BUSINESS_OWNER)
     *
     * @param memberId 현재 로그인한 사용자 ID
     * @return 승급 결과
     */
    @PostMapping("/upgrade")
    public ResponseEntity<Map<String, Object>> upgradeToBusinessOwner(
            @AuthenticationPrincipal Long memberId
    ) {
        log.info("========================================");
        log.info("사업자 회원 승급 요청 - memberId: {}", memberId);

        Member upgradedMember = memberService.upgradeToBusinessOwner(memberId);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "사업자 회원으로 승급되었습니다");
        response.put("role", upgradedMember.getRole().name());

        log.info("사업자 회원 승급 완료 - memberId: {}", memberId);
        log.info("========================================");

        return ResponseEntity.ok(response);
    }

    /**
     * 회원 비활성화 (소프트 삭제)
     * DELETE /api/members/me
     *
     * 실제로 데이터를 삭제하지 않고 isActive = false로 변경
     *
     * @param memberId 현재 로그인한 사용자 ID
     * @return 탈퇴 결과
     */
    @DeleteMapping("/me")
    public ResponseEntity<Map<String, Object>> deactivateMember(
            @AuthenticationPrincipal Long memberId
    ) {
        log.info("========================================");
        log.info("회원 비활성화 요청 - memberId: {}", memberId);

        memberService.deleteMember(memberId);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "회원 탈퇴가 완료되었습니다");

        log.info("회원 비활성화 완료 - memberId: {}", memberId);
        log.info("========================================");

        return ResponseEntity.ok(response);
    }

    /**
     * 회원 영구 삭제 (하드 삭제)
     * DELETE /api/members/me/permanent
     *
     * 실제로 DB에서 데이터 삭제 (주의!)
     *
     * @param memberId 현재 로그인한 사용자 ID
     * @return 삭제 결과
     */
    @DeleteMapping("/me/permanent")
    public ResponseEntity<Map<String, Object>> deleteMember(
            @AuthenticationPrincipal Long memberId
    ) {
        log.warn("========================================");
        log.warn("회원 영구 삭제 요청 - memberId: {}", memberId);

        memberService.deleteMember(memberId);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "회원 정보가 영구적으로 삭제되었습니다");

        log.warn("회원 영구 삭제 완료 - memberId: {}", memberId);
        log.warn("========================================");

        return ResponseEntity.ok(response);
    }

    /**
     * 등급 설명 헬퍼 메서드
     */
    private String getGradeDescription(String grade) {
        return switch (grade) {
            case "BASIC" -> "일반 회원";
            case "ELITE" -> "엘리트 회원 (5% 할인)";
            case "ELITE_PLUS" -> "엘리트+ 회원 (10% 할인)";
            default -> "알 수 없는 등급";
        };
    }
}