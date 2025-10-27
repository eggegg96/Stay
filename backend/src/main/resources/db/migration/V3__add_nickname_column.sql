-- V3__add_nickname_column.sql
-- 회원 테이블에 닉네임 컬럼 추가

-- 1. 닉네임 컬럼 추가 (일단 NULL 허용)
ALTER TABLE members
ADD COLUMN nickname VARCHAR(30) NULL COMMENT '사용자 닉네임 (고유)';

-- 2. 닉네임 유니크 인덱스 추가 (중복 방지)
-- NULL 값은 유니크 제약에서 제외됨
ALTER TABLE members
ADD CONSTRAINT uk_members_nickname UNIQUE (nickname);

-- 3. 기존 회원들에게 임시 닉네임 부여
-- 예: uyu0326@gmail.com → uyu0326_21
UPDATE members
SET nickname = CONCAT(
    SUBSTRING_INDEX(email, '@', 1),  -- 이메일 아이디 부분
    '_',
    member_id                         -- 회원 ID (고유성 보장)
)
WHERE nickname IS NULL;

-- 4. 이제 닉네임을 필수로 변경
ALTER TABLE members
MODIFY COLUMN nickname VARCHAR(30) NOT NULL COMMENT '사용자 닉네임 (고유, 필수)';