-- V1__create_members_and_social_logins_tables.sql
-- 회원 및 소셜 로그인 테이블 초기 생성

-- ==================== 회원 테이블 ====================
CREATE TABLE members (
    member_id BIGINT NOT NULL AUTO_INCREMENT COMMENT '회원 ID (PK)',
    email VARCHAR(100) NOT NULL COMMENT '이메일 (고유)',
    phone_number VARCHAR(20) COMMENT '전화번호',
    name VARCHAR(50) NOT NULL COMMENT '이름',
    role VARCHAR(20) NOT NULL COMMENT '회원 역할 (CUSTOMER, BUSINESS_OWNER, ADMIN)',
    grade VARCHAR(20) NOT NULL COMMENT '회원 등급 (BASIC, ELITE, ELITE_PLUS)',
    reservation_count INT NOT NULL DEFAULT 0 COMMENT '예약 횟수',
    points INT NOT NULL DEFAULT 0 COMMENT '보유 포인트',
    is_active BOOLEAN NOT NULL DEFAULT TRUE COMMENT '활성 상태',
    last_login_at DATETIME COMMENT '마지막 로그인 시간',
    last_grade_updated_at DATETIME COMMENT '마지막 등급 갱신 시간',
    deleted_at DATETIME COMMENT '탈퇴 일시 (소프트 삭제)',
    profile_image_url VARCHAR(500) COMMENT '프로필 이미지 URL',
    created_at DATETIME NOT NULL COMMENT '생성 일시',
    updated_at DATETIME NOT NULL COMMENT '수정 일시',
    created_by VARCHAR(50) COMMENT '생성자',
    updated_by VARCHAR(50) COMMENT '수정자',

    PRIMARY KEY (member_id),
    UNIQUE KEY uk_email (email),
    INDEX idx_email (email),
    INDEX idx_phone (phone_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='회원 정보';

-- ==================== 소셜 로그인 정보 테이블 ====================
CREATE TABLE social_logins (
    social_login_id BIGINT NOT NULL AUTO_INCREMENT COMMENT '소셜 로그인 ID (PK)',
    member_id BIGINT NOT NULL COMMENT '회원 ID (FK)',
    provider VARCHAR(20) NOT NULL COMMENT '소셜 제공자 (GOOGLE, NAVER, KAKAO)',
    social_id VARCHAR(100) NOT NULL COMMENT '소셜 제공자의 고유 ID',
    social_email VARCHAR(100) COMMENT '소셜 제공자의 이메일',
    social_name VARCHAR(100) COMMENT '소셜 제공자의 닉네임/이름',
    profile_image_url VARCHAR(500) COMMENT '소셜 제공자의 프로필 이미지 URL',
    created_at DATETIME NOT NULL COMMENT '생성 일시',
    updated_at DATETIME NOT NULL COMMENT '수정 일시',
    created_by VARCHAR(50) COMMENT '생성자',
    updated_by VARCHAR(50) COMMENT '수정자',

    PRIMARY KEY (social_login_id),
    UNIQUE KEY uk_provider_social_id (provider, social_id),
    INDEX idx_member_id (member_id),
    INDEX idx_provider_social_id (provider, social_id),

    CONSTRAINT fk_social_login_member
        FOREIGN KEY (member_id)
        REFERENCES members(member_id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='소셜 로그인 정보';