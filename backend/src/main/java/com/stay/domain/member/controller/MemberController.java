package com.stay.domain.member.controller;

import com.stay.domain.member.dto.MemberResponse;
import com.stay.domain.member.dto.NicknameCheckResponse;
import com.stay.domain.member.dto.UpdateNicknameRequest;
import com.stay.domain.member.entity.Member;
import com.stay.domain.member.exception.MemberErrorCode;
import com.stay.domain.member.exception.MemberException;
import com.stay.domain.member.service.MemberService;
import jakarta.validation.Valid;
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
     * 포인트 적립
     */
    public void earnPoints(int points) {
        if (points =< 0) {
            throw new MemberException(MemberErrorCode.INVALID_POINT_AMOUNT);
        }
        this.points += points;
    }

    /**
     * 포인트 사용
     */
    public void usePoints(int amount){
        if (amount < 0) {
            throw new MemberException(MemberErrorCode.INVALID_POINT_AMOUNT);
        }
        if(this.points < amount) {
            throw new MemberException(
                    MemberErrorCode.INSUFFICIENT_POINTS,
                    String.format("포인트가 부족합니다. 보유 (보유: %d, 사용시도: %d)", this.points, amount)
            );
        }
    }
    // ==================== 닉네임 관련 API ====================

    /**
     * 닉네임 중복 체크 API
     *
     * 왜 필요한가?
     * - 사용자가 닉네임 입력할 때 실시간으로 사용 가능 여부 확인
     * - 회원가입 폼에서 "이미 사용 중인 닉네임입니다" 피드백 제공
     *
     * 요청 예시:
     * GET /api/members/check-nickname?nickname=멋진닉네임
     *
     * 응답 예시:
     * {
     *   "available": true,
     *   "message": "사용 가능한 닉네임입니다."
     * }
     *
     * @param nickname 확인할 닉네임
     * @return 사용 가능 여부와 메시지
     */
    @GetMapping("/check-nickname")
    public ResponseEntity<NicknameCheckResponse> checkNickname(
            @RequestParam String nickname) {

        log.info("닉네임 중복 체크 요청 - nickname: {}", nickname);

        // 닉네임 중복 여부 확인
        boolean available = memberService.isNicknameAvailable(nickname);

        // 응답 메시지 생성
        String message = available
                ? "사용 가능한 닉네임입니다."
                : "이미 사용 중인 닉네임입니다.";

        NicknameCheckResponse response = new NicknameCheckResponse(available, message);

        return ResponseEntity.ok(response);
    }

    /**
     * 닉네임 설정/변경 API
     *
     * 왜 필요한가?
     * - 소셜 로그인 후 닉네임 설정 단계에서 사용
     * - 마이페이지에서 닉네임 변경 기능 제공
     *
     * 요청 예시:
     * PATCH /api/members/1/nickname
     * {
     *   "nickname": "새로운닉네임"
     * }
     *
     * 응답 예시:
     * {
     *   "id": 1,
     *   "email": "user@example.com",
     *   "nickname": "새로운닉네임",
     *   "name": "홍길동"
     * }
     *
     * @param memberId 회원 ID
     * @param request 닉네임 변경 요청 DTO
     * @return 업데이트된 회원 정보
     */
    @PatchMapping("/{memberId}/nickname")
    public ResponseEntity<MemberResponse> updateNickname(
            @PathVariable Long memberId,
            @RequestBody @Valid UpdateNicknameRequest request) {

        log.info("닉네임 설정 요청 - memberId: {}, nickname: {}",
                memberId, request.nickname());

        // 닉네임 설정
        Member member = memberService.updateNickname(memberId, request.nickname());

        // DTO로 변환하여 응답
        MemberResponse response = MemberResponse.from(member);

        return ResponseEntity.ok(response);
    }

    /**
     * 회원 정보 조회 API (닉네임 포함)
     *
     * 왜 필요한가?
     * - 헤더에서 닉네임 표시
     * - 마이페이지에서 회원 정보 표시
     *
     * 요청 예시:
     * GET /api/members/1
     *
     * 응답 예시:
     * {
     *   "id": 1,
     *   "email": "user@example.com",
     *   "nickname": "멋진닉네임",
     *   "name": "홍길동",
     *   "points": 1000,
     *   "grade": "BASIC"
     * }
     *
     * @param memberId 회원 ID
     * @return 회원 정보
     */
    @GetMapping("/{memberId}")
    public ResponseEntity<MemberResponse> getMember(@PathVariable Long memberId) {
        log.info("회원 조회 요청 - memberId: {}", memberId);

        Member member = memberService.findActiveById(memberId);
        MemberResponse response = MemberResponse.from(member);

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