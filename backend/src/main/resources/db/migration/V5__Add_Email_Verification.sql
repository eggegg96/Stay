-- V5__Add_Email_Verification.sql
-- 이메일 인증 기능 추가

-- ==================== 1. members 테이블에 이메일 인증 필드 추가 ====================

ALTER TABLE members
ADD COLUMN email_verified BOOLEAN NOT NULL DEFAULT FALSE COMMENT '이메일 인증 여부',
ADD COLUMN email_verified_at DATETIME NULL COMMENT '이메일 인증 완료 시간';

-- 기존 회원은 자동으로 인증 완료 처리 (마이그레이션 편의)
UPDATE members
SET email_verified = TRUE,
    email_verified_at = NOW()
WHERE created_at < NOW();

-- ==================== 2. email_verification_tokens 테이블 생성 ====================

CREATE TABLE email_verification_tokens (
    token_id BIGINT NOT NULL AUTO_INCREMENT COMMENT '토큰 ID',
    member_id BIGINT NOT NULL COMMENT '회원 ID',
    token VARCHAR(100) NOT NULL COMMENT '인증 토큰 (UUID)',
    email VARCHAR(100) NOT NULL COMMENT '인증할 이메일',
    expires_at DATETIME NOT NULL COMMENT '토큰 만료 시간',
    verified BOOLEAN NOT NULL DEFAULT FALSE COMMENT '인증 완료 여부',
    verified_at DATETIME NULL COMMENT '인증 완료 시간',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시',
    created_by VARCHAR(50) NULL COMMENT '생성자',
    updated_by VARCHAR(50) NULL COMMENT '수정자',

    PRIMARY KEY (token_id),
    UNIQUE KEY uk_token (token),
    INDEX idx_member_id (member_id),
    INDEX idx_token (token),
    INDEX idx_expires_at (expires_at),
    INDEX idx_verified (verified),
    INDEX idx_member_verified (member_id, verified),
    INDEX idx_verified_expires (verified, expires_at),

    CONSTRAINT fk_email_verification_tokens_member
        FOREIGN KEY (member_id)
        REFERENCES members(member_id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='이메일 인증 토큰';