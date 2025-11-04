package com.stay.domain.member.service;

import com.stay.domain.member.exception.MemberErrorCode;
import com.stay.domain.member.exception.MemberException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

/**
 * 이메일 발송 Service
 *
 * 역할: 실제 이메일 발송 담당 (SMTP 사용)
 *
 * 왜 분리했나?
 * - EmailVerificationService: 비즈니스 로직 (토큰 생성/검증)
 * - EmailService: 기술적 세부사항 (SMTP 발송)
 * → 단일 책임 원칙(SRP) 준수
 *
 * 필요 설정 (application.yml):
 * spring:
 *   mail:
 *     host: smtp.gmail.com
 *     port: 587
 *     username: your-email@gmail.com
 *     password: your-app-password  # Gmail 앱 비밀번호
 *
 * app:
 *   frontend:
 *     url: http://localhost:3000  # 프론트엔드 URL
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;

    // application.yml에서 값 가져오기
    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    @Value("${spring.mail.username}")
    private String fromEmail;

    /**
     * 이메일 인증 메일 발송
     *
     * 왜 try-catch로 감쌌나?
     * - MessagingException은 Checked Exception이라 반드시 처리해야 함
     * - SMTP 서버 문제, 네트워크 오류 등 다양한 이유로 실패 가능
     * - 실패 시 명확한 에러 메시지를 로그에 남기고 예외를 던져야 함
     *
     * @param toEmail 받는 사람 이메일
     * @param token 인증 토큰
     */
    public void sendVerificationEmail(String toEmail, String token) {
        log.info("이메일 인증 메일 발송 시작 - to: {}", toEmail);

        try {
            // 1. 인증 링크 생성
            // 형식: http://localhost:5173/email-verification?token={token}
            // 프론트엔드에서 이 링크를 받아서 백엔드 API 호출
            String verificationLink = String.format("%s/email-verification?token=%s",
                    frontendUrl, token);

            log.debug("인증 링크 생성 완료 - link: {}", verificationLink);

            // 2. 이메일 제목 및 내용 설정
            String subject = "[Stay] 이메일 인증을 완료해주세요";
            String content = createVerificationEmailContent(toEmail, verificationLink);

            // 3. 이메일 발송
            sendHtmlEmail(toEmail, subject, content);

            log.info("이메일 발송 완료 - to: {}", toEmail);

        } catch (MessagingException e) {
            // 이메일 발송 실패 시 로그를 남기고 예외를 던짐
            log.error("이메일 발송 실패 - to: {}, error: {}", toEmail, e.getMessage(), e);

            // 왜 MemberException으로 변환하나?
            // - Controller에서 일관된 에러 응답을 만들기 위함
            // - MessagingException은 기술적 예외라 비즈니스 계층에서 처리하기 어려움
            throw new MemberException(MemberErrorCode.EMAIL_SEND_FAILED);

        } catch (Exception e) {
            // 예상치 못한 에러 (NullPointerException 등)
            log.error("이메일 발송 중 예상치 못한 오류 - to: {}, error: {}",
                    toEmail, e.getMessage(), e);
            throw new MemberException(MemberErrorCode.EMAIL_SEND_FAILED);
        }
    }

    /**
     * HTML 이메일 발송 (실제 발송 로직)
     *
     * 왜 private 메서드로 분리했나?
     * - sendVerificationEmail에서만 사용 (외부 노출 불필요)
     * - 이메일 발송의 기술적 세부사항을 캡슐화
     * - 추후 다른 종류의 이메일 발송 시 재사용 가능
     *
     * MimeMessage vs SimpleMailMessage?
     * - SimpleMailMessage: 텍스트만 (간단하지만 제한적)
     * - MimeMessage: HTML, 첨부파일 가능 (우리가 사용)
     *
     * @throws MessagingException SMTP 발송 실패 시
     */
    private void sendHtmlEmail(String to, String subject, String htmlContent)
            throws MessagingException {

        log.debug("HTML 이메일 생성 시작 - to: {}, subject: {}", to, subject);

        // 1. MimeMessage 생성
        MimeMessage message = mailSender.createMimeMessage();

        // 2. MimeMessageHelper로 이메일 내용 설정
        // 왜 Helper를 사용하나?
        // - MimeMessage API는 복잡함 (setContent, setHeader 등)
        // - Helper는 Spring이 제공하는 편의 클래스
        // - 한글 인코딩(UTF-8) 자동 처리
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromEmail);              // 발신자 (application.yml의 username)
        helper.setTo(to);                       // 수신자
        helper.setSubject(subject);             // 제목
        helper.setText(htmlContent, true);      // 내용 (true = HTML 형식)

        log.debug("이메일 내용 설정 완료 - from: {}, to: {}", fromEmail, to);

        // 3. 이메일 발송
        // 실제로 SMTP 서버로 전송하는 부분
        mailSender.send(message);

        log.debug("SMTP 전송 완료 - to: {}", to);
    }

    /**
     * 이메일 인증 HTML 내용 생성
     *
     * 방법 1: HTML 문자열 직접 작성 (현재 사용)
     * - 장점: 간단, 외부 의존성 없음
     * - 단점: 복잡한 디자인은 관리 어려움
     *
     * 방법 2: Thymeleaf 템플릿 사용 (주석 참고)
     * - 장점: 디자인과 로직 분리, 재사용성
     * - 단점: 템플릿 파일 추가 관리 필요
     *
     * 실무 팁:
     * - 이메일 디자인이 복잡하면 Thymeleaf 사용
     * - 간단한 인증 메일은 문자열로도 충분
     * - 이메일 미리보기 테스트 필수!
     */
    private String createVerificationEmailContent(String email, String verificationLink) {
        // 방법 1: 간단하게 HTML 문자열로 작성
        return String.format("""
            <html>
            <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 0;">
                <div style="max-width: 600px; margin: 40px auto; background-color: white; 
                            border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    
                    <!-- 헤더 -->
                    <div style="background-color: #4CAF50; padding: 30px; border-radius: 8px 8px 0 0;">
                        <h1 style="color: white; margin: 0; font-size: 24px;">Stay</h1>
                    </div>
                    
                    <!-- 본문 -->
                    <div style="padding: 40px 30px;">
                        <h2 style="color: #333; margin-top: 0;">이메일 인증을 완료해주세요</h2>
                        <p style="color: #666; line-height: 1.6;">
                            안녕하세요, <strong>%s</strong>님!
                        </p>
                        <p style="color: #666; line-height: 1.6;">
                            회원가입을 완료하려면 아래 버튼을 클릭해주세요.
                        </p>
                        
                        <!-- 인증 버튼 -->
                        <div style="text-align: center; margin: 40px 0;">
                            <a href="%s" 
                               style="background-color: #4CAF50; color: white; 
                                      padding: 15px 40px; text-decoration: none; 
                                      border-radius: 5px; display: inline-block;
                                      font-weight: bold; font-size: 16px;">
                                이메일 인증하기
                            </a>
                        </div>
                        
                        <!-- 대체 링크 -->
                        <div style="background-color: #f9f9f9; padding: 20px; 
                                    border-radius: 5px; margin-top: 30px;">
                            <p style="color: #666; font-size: 14px; margin: 0 0 10px 0;">
                                버튼이 작동하지 않으면 아래 링크를 복사하여 브라우저에 붙여넣기 해주세요:
                            </p>
                            <p style="color: #0066cc; font-size: 12px; word-break: break-all; margin: 0;">
                                %s
                            </p>
                        </div>
                        
                        <!-- 만료 안내 -->
                        <p style="color: #999; font-size: 13px; margin-top: 30px;">
                            ⚠️ 이 링크는 24시간 후 만료됩니다.
                        </p>
                    </div>
                    
                    <!-- 푸터 -->
                    <div style="background-color: #f5f5f5; padding: 20px 30px; 
                                border-radius: 0 0 8px 8px; text-align: center;">
                        <p style="color: #999; font-size: 12px; margin: 0;">
                            본 메일은 발신 전용입니다. 문의사항은 고객센터를 이용해주세요.<br>
                            © 2025 Stay. All rights reserved.
                        </p>
                    </div>
                </div>
            </body>
            </html>
            """, email, verificationLink, verificationLink);

        // 방법 2: Thymeleaf 템플릿 사용 (선택사항)
        // resources/templates/email/verification.html 파일 생성 필요
        /*
        Context context = new Context();
        context.setVariable("email", email);
        context.setVariable("verificationLink", verificationLink);
        return templateEngine.process("email/verification", context);
        */
    }

    /**
     * 이메일 발송 테스트용 메서드 (개발 단계에서만 사용)
     *
     * 사용 예시:
     * - Postman으로 API 테스트
     * - 실제 이메일이 오는지 확인
     *
     * 주의: 운영 환경에서는 제거하거나 권한 체크 필요
     */
    public void sendTestEmail(String toEmail) {
        log.info("테스트 이메일 발송 - to: {}", toEmail);

        try {
            String subject = "[Stay] 테스트 이메일입니다";
            String content = "<h1>이메일 발송 테스트 성공!</h1><p>SMTP 설정이 올바릅니다.</p>";

            sendHtmlEmail(toEmail, subject, content);

            log.info("테스트 이메일 발송 완료 - to: {}", toEmail);
        } catch (MessagingException e) {
            log.error("테스트 이메일 발송 실패 - to: {}", toEmail, e);
            throw new MemberException(MemberErrorCode.EMAIL_SEND_FAILED);
        }
    }
}