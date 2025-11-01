-- V6: members 테이블의 password 컬럼을 nullable로 변경
--
-- 변경 이유:
-- 1. 소셜 로그인 사용자는 비밀번호가 필요없음
-- 2. 일반 회원가입 사용자만 비밀번호 필요
-- 3. 두 가지 가입 방식을 모두 지원하기 위해 password를 선택 필드로 변경

-- password 컬럼을 NULL 허용으로 변경
ALTER TABLE members
    ADD COLUMN password VARCHAR(255) NULL COMMENT '비밀번호 (소셜 로그인 시 NULL)'
    AFTER email;

-- 마이그레이션 완료 로그