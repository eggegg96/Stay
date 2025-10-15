package com.stay.controller;

import com.stay.domain.member.dto.SocialLoginRequest;
import com.stay.domain.member.dto.SocialLoginResult;
import com.stay.domain.member.entity.Member;
import com.stay.domain.member.service.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * 회원 테스트 컨트롤러
 * 개발 환경 테스트용
 */
@Slf4j
@RestController
@RequestMapping("/api/test/members")
@RequiredArgsConstructor
public class MemberTestController {

    private final MemberService memberService;

    /**
     * 헬스체크
     * GET http://localhost:8080/api/test/members/health
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "OK");
        response.put("message", "MemberService is running!");
        return ResponseEntity.ok(response);
    }

    /**
     * 소셜 로그인 테스트
     * POST http://localhost:8080/api/test/members/social-login
     */
    @PostMapping("/social-login")
    public ResponseEntity<Map<String, Object>> testSocialLogin(
            @RequestBody SocialLoginRequest request
    ) {
        log.info("테스트: 소셜 로그인 요청 - {}", request);

        try {
            // 반환 타입 변경: Member → SocialLoginResult
            SocialLoginResult result = memberService.socialLogin(request);
            Member member = result.getMember();

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "소셜 로그인 성공!");
            response.put("isNewMember", result.isNewMember()); // 신규 회원 여부 추가
            response.put("member", Map.of(
                    "id", member.getId(),
                    "email", member.getEmail(),
                    "name", member.getName(),
                    "role", member.getRole().name(),
                    "grade", member.getGrade().name(),
                    "points", member.getPoints(),
                    "isActive", member.getIsActive()
            ));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("테스트: 소셜 로그인 실패", e);

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "소셜 로그인 실패: " + e.getMessage());

            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    /**
     * 회원 조회
     * GET http://localhost:8080/api/test/members/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getMember(@PathVariable Long id) {
        try {
            Member member = memberService.findById(id);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("member", Map.of(
                    "id", member.getId(),
                    "email", member.getEmail(),
                    "name", member.getName(),
                    "role", member.getRole().name(),
                    "grade", member.getGrade().name(),
                    "points", member.getPoints(),
                    "isActive", member.getIsActive()
            ));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    /**
     * 포인트 적립
     * POST http://localhost:8080/api/test/members/{id}/earn-points?points=1000
     */
    @PostMapping("/{id}/earn-points")
    public ResponseEntity<Map<String, Object>> earnPoints(
            @PathVariable Long id,
            @RequestParam Integer points
    ) {
        try {
            Member member = memberService.earnPoints(id, points);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", points + "P 적립 완료!");
            response.put("totalPoints", member.getPoints());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}