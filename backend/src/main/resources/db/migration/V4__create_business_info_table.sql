-- V4__create_business_info_table.sql
-- 사업자 정보 테이블 생성
-- Flyway용: DELIMITER 명령어 없이 작성

-- ==================== 사업자 정보 테이블 ====================
CREATE TABLE business_info (
    business_info_id BIGINT NOT NULL AUTO_INCREMENT COMMENT '사업자 정보 ID (PK)',
    member_id BIGINT NOT NULL COMMENT '회원 ID (FK)',
    business_number VARCHAR(12) NOT NULL COMMENT '사업자 등록번호 (XXX-XX-XXXXX)',
    company_name VARCHAR(100) NOT NULL COMMENT '회사명/사업장명',
    email_verified BOOLEAN NOT NULL DEFAULT FALSE COMMENT '이메일 인증 여부',
    email_verified_at DATETIME COMMENT '이메일 인증 완료 시각',
    bank_name VARCHAR(50) COMMENT '정산 계좌 은행명',
    bank_account VARCHAR(50) COMMENT '정산 계좌 번호',
    account_holder VARCHAR(50) COMMENT '계좌 예금주명',
    approval_status VARCHAR(20) NOT NULL DEFAULT 'PENDING' COMMENT '승인 상태 (PENDING/APPROVED/REJECTED)',
    approval_note VARCHAR(500) COMMENT '승인/거부 사유',
    approved_at DATETIME COMMENT '승인 처리 일시',
    created_at DATETIME NOT NULL COMMENT '생성 일시',
    updated_at DATETIME NOT NULL COMMENT '수정 일시',
    created_by VARCHAR(50) COMMENT '생성자',
    updated_by VARCHAR(50) COMMENT '수정자',

    PRIMARY KEY (business_info_id),
    UNIQUE KEY uk_member_id (member_id),
    UNIQUE KEY uk_business_number (business_number),
    INDEX idx_business_number (business_number),
    INDEX idx_member_id (member_id),
    INDEX idx_approval_status (approval_status),

    CONSTRAINT fk_business_info_member
        FOREIGN KEY (member_id)
        REFERENCES members(member_id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='사업자 정보';

-- ==================== business_info 테이블 트리거 ====================

-- 사업자 정보 생성 시 created_at, updated_at 자동 설정
CREATE TRIGGER trg_business_info_before_insert
BEFORE INSERT ON business_info
FOR EACH ROW
BEGIN
    SET NEW.created_at = NOW();
    SET NEW.updated_at = NOW();
END;

-- 사업자 정보 수정 시 updated_at 자동 갱신
CREATE TRIGGER trg_business_info_before_update
BEFORE UPDATE ON business_info
FOR EACH ROW
BEGIN
    SET NEW.updated_at = NOW();
END;