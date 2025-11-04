package com.stay.domain.member.service;

import com.stay.domain.member.entity.EmailVerificationToken;
import com.stay.domain.member.entity.Member;
import com.stay.domain.member.exception.MemberErrorCode;
import com.stay.domain.member.exception.MemberException;
import com.stay.domain.member.repository.EmailVerificationTokenRepository;
import com.stay.domain.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * 이메일 인증 Service
 *
 * 주요 역할:
 * 1. 인증 토큰 생성 및 이메일 발송
 * 2. 토큰 검증 및 이메일 인증 처리
 * 3. 만료된 토큰 관리
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmailVerificationService {

    private final EmailVerificationTokenRepository tokenRepository;
    private final MemberRepository memberRepository;
    private final EmailService emailService;

    // application.yml에서 설정값 가져오기
    @Value("${app.email.verification.expiration-hours:24}")
    private int expirationHours;

    /**
     * 인증 토큰 생성 및 이메일 발송
     *
     * 호출 시점: 사업자 회원가입 직후
     *
     * @param member 인증할 회원
     */
    @Transactional
    public void createAndSendVerificationToken(Member member) {
        log.info("이메일 인증 토큰 생성 - memberId: {}, email: {}",
                member.getId(), member.getEmail());

        // 1. 기존 미인증 토큰 삭제 (중복 방지)
        tokenRepository.deleteVerifiedTokensByMember(member);
        log.debug("기존 토큰 삭제 완료 - memberId: {}", member.getId());

        // 2. 새로운 토큰 생성(UUID 사용)
        String token = UUID.randomUUID().toString();
        log.debug("토큰 생성 완료 - token: {}", token);

        // 3. 만료 시간 설정 (현재 시간 + 설정된 시간)
        LocalDateTime expiresAt = LocalDateTime.now().plusHours(expirationHours);
        log.debug("토큰 만료 시간 설정 - expiresAt: {}", expiresAt);

        // 4. EmailVerificationToken 엔티티 생성
        EmailVerificationToken verificationToken = EmailVerificationToken.builder()
                .member(member)
                .token(token)
                .email(member.getEmail())
                .expiresAt(expiresAt)
                .build();

        // 5. DB에 저장
        tokenRepository.save(verificationToken);
        log.info("토큰 DB 저장 완료 - tokenId: {}", verificationToken.getId());

        // 6. 이메일 발송
        emailService.sendVerificationEmail(member.getEmail(), token);

        log.info("이메일 인증 링크 발송 완료 - eamil: {}, token: {}", member.getEmail(), token);
    }

    /**
     * 토큰으로 이메일 인증 처리
     *
     * 호출 시점: 사용자가 이메일 인증 링크 클릭
     *
     * @param token 인증 토큰
     */
    @Transactional
    public void verifyEmailByToken(String token) {
        log.info("이메일 인증 처리 시작 - token: {}", token);

        // 1. 토큰으로 EmailVerificationToken 조회
        EmailVerificationToken verificationToken = tokenRepository
                .findByToken(token)
                .orElseThrow(() -> {
                    log.warn("유효하지 않은 토큰 - token: {}", token);
                    return new MemberException(MemberErrorCode.VERIFICATION_TOKEN_NOT_FOUND);
                });
        log.debug("토큰 조회 완료 - tokenId: {}, memberId: {}", verificationToken.getId(), verificationToken.getMember().getId());

        // 2. 토큰 사용 가능 여부 확인 (만료 여부, 이미 사용됨 여부)
        if (!verificationToken.isUsable()) {
            if (verificationToken.isVerified()) {
                log.warn("이미 사용된 토큰 - tokenId: {}", verificationToken.getId());
                throw new MemberException(MemberErrorCode.VERIFICATION_TOKEN_ALREADY_USED);
            }
            // 만료된 토큰
            if (verificationToken.isExpired()) {
                log.warn("만료된 토큰 - tokenId: {}, expiresAt: {}", verificationToken.getId(), verificationToken.getVerifiedAt());
            throw new MemberException(MemberErrorCode.VERIFICATION_TOKEN_EXPIRED);
            }
        }

        // 3. 토큰 인증 처리 (verified = true, verifiedAt = now)
        verificationToken.verify();
        log.debug("토큰 인증 처리 완료 - tokenId: {}", verificationToken.getId());

        // Member의 이메일 인증 상태 업데이트
        Member member = verificationToken.getMember();

        if (member.isEmailVerified()) {
            log.warn("이미 인증된 회원 - memberId: {}", member.getId());
            throw new MemberException(MemberErrorCode.ALREADY_VERIFIED);
        }
        member.verifyEmail();

        log.info("이메일 인증 완료 - memberId: {}", member.getId(), member.getEmail());
    }

    /**
     * 인증 메일 재발송
     *
     * 호출 시점: 사용자가 "인증 메일 재발송" 버튼 클릭
     *
     * @param email 회원 이메일
     */
    @Transactional
    public void resendVerificationEmail(String email) {
        log.info("인증 메일 재발송 - email: {}", email);

        // 1. 이메일로 회원 조회
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> {
                    log.warn("존재하지 않는 이메일 - email: {}", email);
                    return new MemberException(MemberErrorCode.MEMBER_NOT_FOUND);
                });

        // 2. 이미 인증된 회원인지 확인
        if (member.isEmailVerified()) {
            log.warn("이미 인증된 회원 - memberId: {}", member.getId());
            throw new MemberException(MemberErrorCode.ALREADY_VERIFIED);
        }

        // 3. 새로운 토큰 생성 및 이메일 발송
        // 힌트: createAndSendVerificationToken(member);
        createAndSendVerificationToken(member);

        log.info("인증 메일 재발송 완료 - email: {}", email);
    }

    /**
     * 만료된 토큰 정리 (스케줄러에서 호출 예정)
     *
     * 왜 필요한가?
     * - DB 용량 관리
     * - 불필요한 데이터 삭제
     *
     * 사용 예시:
     * @Scheduled(cron = "0 0 3 * * *")  // 매일 새벽 3시
     * public void cleanupExpiredTokens() {
     *     emailVerificationService.deleteExpiredTokens();
     * }
     *
     * @return 삭제된 토큰 개수
     */

    @Transactional
    public int deleteExpiredTokens() {  // int로 변경
        log.info("만료된 토큰 정리 시작");
        int deletedCount = tokenRepository.deleteExpiredTokens(LocalDateTime.now());
        log.info("만료된 토큰 정리 완료 - 삭제된 개수: {}", deletedCount);
        return deletedCount;
    }

    public EmailVerificationToken getLatestToken(Long memberId) {
        return tokenRepository.findLatestByMemberId(memberId).orElse(null);
    }
}