package com.stay.domain.member.controller;

import com.stay.domain.member.dto.EmailVerificationDto;
import com.stay.domain.member.service.EmailService;
import com.stay.domain.member.service.EmailVerificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * 이메일 인증 Controller
 *
 * 엔드포인트:
 * - POST /api/email-verification/send     : 인증 메일 발송
 * - GET  /api/email-verification/verify   : 토큰으로 인증 처리
 * - POST /api/email-verification/resend   : 인증 메일 재발송
 * - GET  /api/email-verification/test     : 이메일 발송 테스트 (개발용)
 */
@Slf4j
@RestController
@RequestMapping("/api/email-verification")
@RequiredArgsConstructor
public class EmailVerificationController {

    private final EmailVerificationService emailVerificationService;
    private final EmailService emailService;

    /**
     * 🧪 이메일 발송 테스트 API (개발용)
     *
     * 왜 필요한가?
     * - SMTP 설정이 올바른지 확인
     * - Gmail 앱 비밀번호가 맞는지 확인
     * - 실제로 이메일이 발송되는지 확인
     *
     * 사용 방법:
     * GET http://localhost:8080/api/email-verification/test?email=본인이메일@gmail.com
     *
     * 주의: 운영 환경에서는 제거하거나 관리자 권한 필요!
     */
    @GetMapping("/test")
    public ResponseEntity<String> testEmail(@RequestParam String email) {
        log.info("이메일 발송 테스트 요청 - email: {}", email);

        try {
            emailService.sendTestEmail(email);
            return ResponseEntity.ok("테스트 이메일이 발송되었습니다. 메일함을 확인해주세요!");
        } catch (Exception e) {
            log.error("이메일 발송 테스트 실패", e);
            return ResponseEntity.internalServerError()
                    .body("이메일 발송 실패: " + e.getMessage());
        }
    }

    /**
     * 인증 메일 재발송
     *
     * POST /api/email-verification/resend
     * Body: { "email": "user@example.com" }
     */
    @PostMapping("/resend")
    public ResponseEntity<EmailVerificationDto.SendResponse> resendEmail(
            @RequestBody EmailVerificationDto.ResendRequest request) {

        log.info("인증 메일 재발송 요청 - email: {}", request.getEmail());

        try {
            emailVerificationService.resendVerificationEmail(request.getEmail());

            return ResponseEntity.ok(
                    EmailVerificationDto.SendResponse.success(request.getEmail())
            );
        } catch (Exception e) {
            log.error("인증 메일 재발송 실패 - email: {}", request.getEmail(), e);

            return ResponseEntity.badRequest()
                    .body(EmailVerificationDto.SendResponse.failure(
                            request.getEmail(), e.getMessage()
                    ));
        }
    }

    /**
     * 토큰으로 이메일 인증 처리
     *
     * GET /api/email-verification/verify?token={token}
     *
     * 프론트엔드에서 호출:
     * 사용자가 이메일 링크 클릭 → 프론트엔드 페이지 이동 → 이 API 호출
     */
    @GetMapping("/verify")
    public ResponseEntity<EmailVerificationDto.VerifyResponse> verifyEmail(
            @RequestParam String token) {

        log.info("이메일 인증 처리 요청 - token: {}", token);

        try {
            emailVerificationService.verifyEmailByToken(token);

            return ResponseEntity.ok(EmailVerificationDto.VerifyResponse.success());
        } catch (Exception e) {
            log.error("이메일 인증 실패 - token: {}", token, e);

            return ResponseEntity.badRequest()
                    .body(EmailVerificationDto.VerifyResponse.failure(e.getMessage()));
        }
    }
}