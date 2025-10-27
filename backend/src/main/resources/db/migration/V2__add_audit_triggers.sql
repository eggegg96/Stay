-- V2__add_audit_triggers.sql
-- 생성일시/수정일시 자동 업데이트 트리거 추가
-- Flyway용: DELIMITER 명령어 없이 작성

-- ==================== members 테이블 트리거 ====================

-- 회원 생성 시 created_at, updated_at 자동 설정
CREATE TRIGGER trg_members_before_insert
BEFORE INSERT ON members
FOR EACH ROW
BEGIN
    SET NEW.created_at = NOW();
    SET NEW.updated_at = NOW();
END;

-- 회원 수정 시 updated_at 자동 갱신
CREATE TRIGGER trg_members_before_update
BEFORE UPDATE ON members
FOR EACH ROW
BEGIN
    SET NEW.updated_at = NOW();
END;

-- ==================== social_logins 테이블 트리거 ====================

-- 소셜 로그인 정보 생성 시 created_at, updated_at 자동 설정
CREATE TRIGGER trg_social_logins_before_insert
BEFORE INSERT ON social_logins
FOR EACH ROW
BEGIN
    SET NEW.created_at = NOW();
    SET NEW.updated_at = NOW();
END;

-- 소셜 로그인 정보 수정 시 updated_at 자동 갱신
CREATE TRIGGER trg_social_logins_before_update
BEFORE UPDATE ON social_logins
FOR EACH ROW
BEGIN
    SET NEW.updated_at = NOW();
END;