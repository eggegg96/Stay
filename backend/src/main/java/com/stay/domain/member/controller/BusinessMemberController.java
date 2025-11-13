package com.stay.domain.member.controller;

import com.stay.domain.member.dto.BusinessMemberRegisterRequest;
import com.stay.domain.member.entity.Member;
import com.stay.domain.member.service.BusinessMemberService;
import com.stay.domain.member.service.EmailVerificationService;
import com.stay.domain.member.service.MemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * 비즈니스 회원 API 컨트롤러
 *
 * 역할:
 * - 사업자 회원가입 처리 (인증 불필요)
 * - 사업자 등록번호 중복 체크
 * - 이메일 인증 처리
 *
 * 보안:
 * - SecurityConfig에서 /api/business/** 는 permitAll() 설정
 * - 회원가입은 누구나 접근 가능해야 함
 *
 * 일반 MemberController와의 차이:
 * - MemberController: 인증된 사용자의 정보 관리 (JWT 필수)
 * - BusinessMemberController: 회원가입 처리 (JWT 불필요)
 */
@Slf4j
@RestController
@RequestMapping("/api/business")
@RequiredArgsConstructor
public class BusinessMemberController {

    private final BusinessMemberService businessMemberService;
    private final MemberService memberService;
    private final EmailVerificationService emailVerificationService;

    // ==================== 사업자 등록번호 검증 ====================

    /**
     * 사업자 등록번호 중복 체크 API
     *
     * 왜 필요한가?
     * - 프론트엔드 회원가입 폼에서 실시간으로 중복 체크
     * - 한 사업자 등록번호로 중복 가입 방지
     * - 사용자에게 즉각적인 피드백 제공
     *
     * 엔드포인트:
     * GET /api/business/check-business-number?businessNumber=123-45-67890
     *
     * 프론트엔드 사용 예시:
     * ```javascript
     * const response = await axios.get('/api/business/check-business-number', {
     *   params: { businessNumber: '123-45-67890' }
     * });
     * if (response.data.available) {
     *   // 사용 가능한 사업자 등록번호
     * }
     * ```
     *
     * @param businessNumber 사업자 등록번호 (XXX-XX-XXXXX 형식)
     * @return available: 사용 가능 여부 (true/false)
     */
    @GetMapping("/check-business-number")
    public ResponseEntity<Map<String, Object>> checkBusinessNumber(
            @RequestParam String businessNumber
    ) {
        log.info("========================================");
        log.info("사업자 등록번호 중복 체크 요청 - businessNumber: {}", businessNumber);

        boolean isAvailable = businessMemberService.isBusinessNumberAvailable(businessNumber);

        Map<String, Object> response = new HashMap<>();
        response.put("available", isAvailable);
        response.put("businessNumber", businessNumber);

        if (isAvailable) {
            response.put("message", "사용 가능한 사업자 등록번호입니다");
        } else {
            response.put("message", "이미 등록된 사업자 등록번호입니다");
        }

        log.info("중복 체크 결과 - available: {}", isAvailable);
        log.info("========================================");

        return ResponseEntity.ok(response);
    }

    // ==================== 사업자 회원가입 ====================

    /**
     * 사업자 회원가입 API
     *
     * 왜 필요한가?
     * - 일반 회원과 다른 가입 플로우 (사업자 정보 필수)
     * - 이메일 인증 필수
     * - 관리자 승인 프로세스 (추후)
     *
     * 엔드포인트:
     * POST /api/business/register
     *
     * 요청 본문:
     * {
     *   "email": "business@example.com",
     *   "password": "password123!",
     *   "name": "홍길동",
     *   "phoneNumber": "010-1234-5678",
     *   "businessNumber": "123-45-67890",
     *   "companyName": "주식회사 스테이"
     * }
     *
     * 응답:
     * {
     *   "success": true,
     *   "message": "사업자 회원가입이 완료되었습니다. 이메일 인증을 진행해주세요.",
     *   "memberId": 1,
     *   "email": "business@example.com"
     * }
     *
     * 프론트엔드 처리:
     * 1. 회원가입 성공 → 이메일 발송 안내 페이지로 이동
     * 2. 이메일 인증 대기
     * 3. 인증 완료 → 로그인 페이지로 이동
     *
     * @param request 사업자 회원가입 요청 데이터
     * @return 회원가입 결과
     */
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> registerBusinessMember(
            @Valid @RequestBody BusinessMemberRegisterRequest request
    ) {
        log.info("========================================");
        log.info("사업자 회원가입 요청 - email: {}, businessNumber: {}",
                request.getEmail(), request.getBusinessNumber());

        // 사업자 회원 등록 (Member + BusinessInfo 생성)
        Member member = businessMemberService.registerBusinessMember(
                request.getEmail(),
                request.getPassword(),
                request.getName(),
                request.getPhoneNumber(),
                request.getBusinessNumber(),
                request.getCompanyName()
        );

        // 이메일 인증 토큰 생성 및 발송
        emailVerificationService.createAndSendVerificationToken(member);
        log.info("이메일 인증 링크 발송 완료 - email: {}", member.getEmail());

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "사업자 회원가입이 완료되었습니다. 이메일 인증을 진행해주세요.");
        response.put("memberId", member.getId());
        response.put("email", member.getEmail());

        log.info("사업자 회원가입 완료 - memberId: {}", member.getId());
        log.info("========================================");

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // ==================== 이메일 인증 ====================

    /**
     * 이메일 인증 처리 API
     *
     * 왜 필요한가?
     * - 이메일 링크 클릭 시 인증 완료 처리
     * - BusinessInfo의 emailVerified를 true로 변경
     *
     * 엔드포인트:
     * GET /api/business/verify-email?token={token}
     *
     * 플로우:
     * 1. 이메일 인증 링크 클릭
     * 2. 프론트엔드가 이 API 호출
     * 3. 백엔드에서 토큰 검증 및 인증 처리
     * 4. 성공 → 로그인 페이지로 리다이렉트
     *
     * @param token 이메일 인증 토큰 (JWT 또는 UUID)
     * @return 인증 결과
     */
    @GetMapping("/verify-email")
    public ResponseEntity<Map<String, Object>> verifyEmail(
            @RequestParam String token
    ) {
        log.info("========================================");
        log.info("이메일 인증 요청 - token: {}", token);

        // TODO: 토큰 검증 로직 추가 필요
        // 1. 토큰에서 memberId 추출
        // 2. 토큰 유효성 검증 (만료 시간 체크)
        // 3. 이미 인증된 이메일인지 체크

        // 임시: 토큰을 memberId로 가정
        Long memberId = Long.parseLong(token);

        businessMemberService.verifyBusinessEmail(memberId);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "이메일 인증이 완료되었습니다. 로그인해주세요.");

        log.info("이메일 인증 완료 - memberId: {}", memberId);
        log.info("========================================");

        return ResponseEntity.ok(response);
    }

    // ==================== 회원가입 헬퍼 메서드 ====================

    /**
     * 이메일 중복 체크 API
     *
     * 왜 필요한가?
     * - 프론트엔드 회원가입 폼에서 실시간 검증
     * - 중복 이메일 사전 방지
     *
     * @param email 이메일
     * @return available: 사용 가능 여부
     */
    @GetMapping("/check-email")
    public ResponseEntity<Map<String, Object>> checkEmail(
            @RequestParam String email
    ) {
        log.info("이메일 중복 체크 요청 - email: {}", email);

        // TODO: MemberService에 이메일 중복 체크 메서드 추가 필요
        // boolean isAvailable = memberService.isEmailAvailable(email);
        boolean isAvailable = true; // 임시

        Map<String, Object> response = new HashMap<>();
        response.put("available", isAvailable);
        response.put("email", email);

        if (isAvailable) {
            response.put("message", "사용 가능한 이메일입니다");
        } else {
            response.put("message", "이미 사용 중인 이메일입니다");
        }

        return ResponseEntity.ok(response);
    }
}