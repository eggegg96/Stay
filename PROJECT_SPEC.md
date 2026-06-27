# Stay 클론 프로젝트 명세서

## 프로젝트 목표

여기어때 클론 프로젝트 - 숙박 예약 플랫폼 구현

---

## 기술 스택

- **Frontend**
  - Framework: React 19
  - Build Tool: Vite
  - Styling: TailwindCSS 4
  - Router: React Router v6
  - State Management: Zustand, Context API (레이아웃 한정), Custom Hooks
  - HTTP Client: Axios

- **Backend**
  - Framework: Spring Boot 3.5.6
  - Language: Java 17
  - Database: MySQL 8.0
  - ORM: Spring Data JPA (Hibernate)
  - Security: Spring Security + JWT (HttpOnly Cookie)
  - Migration: Flyway
  - Cache/Session: Redis (이메일 인증 토큰 관리)

- **External APIs**
  - 지도: 카카오맵 (국내), 구글맵 (해외)
  - 소셜 로그인: 구글, 네이버, 카카오
  - 결제: 토스페이먼츠 or 카카오페이 (예정)

---

## 개발 로드맵

### Phase 0: 프로젝트 기초 & 핵심 UI 구축 (완료)

#### 0.1 프로젝트 설정

- Vite + React 19 초기 설정
- TailwindCSS 4 설정
- React Router 설정
- 폴더 구조 설계
- Spring Boot 프로젝트 생성

#### 0.2 레이아웃 시스템

- 헤더/푸터 레이아웃
- 검색 모드 & 디테일 모드 헤더
- HeaderContext 상태 관리
- 반응형 디자인 기초

#### 0.3 핵심 페이지 구성

- **홈 페이지**: 메인 검색, 인기 숙소, 이벤트
- **검색 결과 페이지**: 필터링, 정렬, 카드 리스트
- **숙소 상세 페이지**: 갤러리, 객실 선택, 예약 UI
- **로그인/회원가입 페이지**: 소셜 로그인, 4단계 회원가입

#### 0.4 재사용 컴포넌트 라이브러리

- 숙소 관련 컴포넌트 (카드, 리스트, 정렬 등)
- 검색 관련 컴포넌트 (폼, 팝오버, 요약 바)
- 필터 컴포넌트 (가격, 편의시설, 카테고리)
- 인증 컴포넌트 (소셜 로그인, 회원가입 스텝)

#### 0.5 Hooks & Utils

- 커스텀 훅 (파라미터, 필터링, 상태 관리)
- 유틸리티 함수 (날짜, 지역명, 검색)

#### 0.6 목업 데이터

- 국내 숙소 10개
- 해외 숙소 10개
- 필터 상수 정의

---

### Phase 1: 검색 및 지도 연동 (완료)

#### 1.1 검색 관용성 개선

- 국내 지역명 별칭 처리 (제주 → 제주도)
- 공백 무시 검색
- 키워드 정규화 및 매칭 점수 시스템
- 구현 위치: `frontend/src/searchEngine/`

#### 1.2 해외 숙소 구글맵 API 적용

- 해외 숙소의 경우 구글맵으로 위치 표시
- 국내 숙소는 기존 카카오맵 유지
- 지도 API 자동 선택 로직

---

### Phase 2: 회원 시스템 (진행중)

#### 2.1 프론트엔드 인증 UI (완료)

- 소셜 로그인 버튼 (구글/네이버/카카오)
- 4단계 일반 회원가입 플로우
- OAuth 콜백 페이지
- 사업자 회원가입 플로우 (Zustand 상태 관리)
- 사업자 회원가입 API 연동

#### 2.2 백엔드 회원 도메인 (완료)

**엔티티:**

- Member — 이메일, 전화번호, 이름, 닉네임, 생년월일, 성별, 이메일 인증 여부, 회원 역할, 회원 등급, 예약 횟수, 포인트, 프로필 이미지 URL
- SocialLogin — 소셜 계정 연동 정보
- BusinessInfo — 사업자 등록번호, 회사명, 계좌 정보
- EmailVerificationToken — DB 기반 이메일 인증 토큰
- MemberRole Enum — CUSTOMER, BUSINESS_OWNER, ADMIN
- MemberGrade Enum — BASIC, ELITE, ELITE_PLUS (할인율 계산 로직 포함)
- SocialProvider Enum — GOOGLE, NAVER, KAKAO

**Service:**

- MemberService — 회원 가입/조회, 이메일 중복 체크, 닉네임 관리, 등급 관리, 포인트 관리, 회원 탈퇴
- AuthService — OAuth 로그인 처리, 토큰 재발급
- OAuthService — 구글/네이버/카카오 OAuth 처리
- BusinessMemberService — 사업자 회원가입, 사업자 등록번호 중복 체크
- EmailVerificationService — DB 기반 인증 토큰 관리, Redis 기반 선인증 플로우
- EmailService — JavaMailSender 기반 이메일 발송

**Controller / API 엔드포인트:**

| 엔드포인트                              | 설명                                 |
| --------------------------------------- | ------------------------------------ |
| POST /api/auth/login                    | 이메일/비밀번호 로그인               |
| POST /api/auth/oauth/login              | OAuth 로그인 (HttpOnly 쿠키 발급)    |
| POST /api/auth/oauth/register           | OAuth 최종 회원가입 (닉네임 포함)    |
| POST /api/auth/oauth/logout             | 로그아웃 (쿠키 삭제)                 |
| POST /api/auth/oauth/refresh            | Access Token 갱신                    |
| GET /api/members/me                     | 내 정보 조회                         |
| GET /api/members/me/points              | 내 포인트 조회                       |
| GET /api/members/check-nickname         | 닉네임 중복 체크                     |
| PATCH /api/members/{memberId}/nickname  | 닉네임 변경                          |
| POST /api/members/upgrade               | 사업자 회원 승급                     |
| DELETE /api/members/me                  | 회원 탈퇴 (소프트)                   |
| DELETE /api/members/me/permanent        | 회원 영구 삭제                       |
| POST /api/business/register             | 사업자 회원가입                      |
| GET /api/business/check-business-number | 사업자 등록번호 중복 체크            |
| GET /api/business/check-email           | 이메일 중복 체크                     |
| POST /api/email-verification/send       | 인증 메일 발송 (Redis 선인증 플로우) |
| POST /api/email-verification/resend     | 인증 메일 재발송                     |
| GET /api/email-verification/verify      | 토큰으로 이메일 인증 처리            |

**보안:**

- JWT 토큰 (HttpOnly Cookie 방식)
- Access Token 유효기간: 1시간
- Refresh Token 유효기간: 7일
- Spring Security + JwtAuthenticationFilter

**SecurityConfig permitAll 경로:**

```
/api/auth/**
/api/business/**
/api/email-verification/**
/api/members/check-nickname
/api/test/**
/health, /error
```

**Redis:**

- 용도: 이메일 선인증 토큰 관리 (회원가입 전 이메일 인증)
- `email:verify:token:{UUID}` → email (TTL 24시간)
- `email:verify:done:{email}` → "true" (TTL 24시간)

**데이터베이스 마이그레이션 (Flyway):**

- V1: members, social_logins 테이블 생성
- V2: 인덱스 추가
- V3: nickname 컬럼 추가 (unique 제약)
- V4: business_info 테이블 생성
- V5: email_verification_tokens 테이블 생성
- V6: password nullable 처리 (소셜 로그인 회원 대응)
- V7: birth_date, gender 컬럼 추가

#### 2.3 미완성 작업

- 프론트 이메일 인증 연동 (EmailVerificationPage, BusinessEmailVerification, BusinessEmailSent API 연동)
- 이메일/비밀번호 로그인 DB 연동
- JWT에 role 추가
- 사업자 로그인 후 role 기반 대시보드 이동
- /business/dashboard 페이지 생성

---

### Phase 3: 예약 시스템 (진행 예정)

> **결제 정보 수집 방식**: 예약 시점에 결제 정보를 받는 방식 (여기어때 방식)

#### 3.1 기본 예약 생성

- 날짜 선택 UI
- 객실 선택 인터페이스
- 인원 선택
- 예약 정보 임시 저장 (결제 실패 대비)

#### 3.2 예약 조회 및 관리

- 예약 내역 조회
- 예약 상세 정보 표시
- 예약 상태별 필터링

#### 3.3 예약 취소

- 취소 가능 기간 체크
- 취소 수수료 계산
- 환불 처리

#### 3.4 결제 연동

- PG사 결제창 연동 (카카오페이, 토스페이먼츠)
- 결제 성공/실패 처리
- 예약 확정 로직
- 동시성 제어 (낙관적 잠금)

**예약 플로우:**

```
예약 페이지 (날짜/인원 선택)
    ↓
예약 확인 페이지 (가격 확인)
    ↓
결제 페이지
    ↓
PG사 결제창 호출
    ↓
결제 결과 처리
    ↓
예약 완료/실패
```

---

### Phase 4: 리뷰 시스템 (진행 예정)

- 숙소 이용 후 48시간 이내 작성 가능
- 별점 (1~5) + 텍스트 + 이미지 업로드 (선택)
- 숙소별 리뷰 목록, 평점 평균, 정렬
- 작성자 본인만 수정/삭제 가능

---

### Phase 5: 회원 등급 및 혜택 시스템 (진행 예정)

**등급 구조:**

```
Basic    (이용횟수 3회 미만)  — 할인율 0%, 리뷰 포인트 최대 2,000P
Elite    (이용횟수 3~6회)    — 할인율 3%, 리뷰 포인트 최대 3,000P, 전용 쿠폰
Elite+   (이용횟수 7회 이상) — 할인율 5%, 리뷰 포인트 최대 5,000P, 전용 쿠폰, 우선 상담
```

- 백엔드: MemberGrade Enum, 등급 자동 갱신 로직, 할인 금액 계산 완료
- 프론트: 등급 UI, 할인 가격 표시, 등급 혜택 페이지 (미완성)
- 배치: 매달 1일 최근 2년 기준 등급 재계산

---

### Phase 6: 사업자 페이지 구현 (진행 예정)

#### 6.1 숙소 관리

- 숙소 등록/수정/삭제 (기본 정보, 이미지 최대 20장, 시설, 체크인/아웃 규정)

#### 6.2 객실 관리

- 객실 등록/수정/삭제, 예약 가능 날짜 설정

#### 6.3 예약 관리

- 실시간 예약 현황, 예약 확인/취소

#### 6.4 매출 관리

- 수익 대시보드
  - 일/주/월/년 매출 통계
  - 객실별 점유율 분석
  - 평균 숙박 기간 통계
- 정산
  - 정산 요청
  - 정산 수단: 사업자 회원가입 시 등록한 계좌

#### 6.5 쿠폰 관리

- 쿠폰 등록/삭제/통계

#### 6.6 리뷰 관리

- 고객 리뷰 확인, 답변 작성

---

### Phase 7: 사이트 관리자 (Admin) (진행 예정)

- 회원 관리 (목록 조회, 정지/탈퇴, 사업자 승인)
- 신고 관리 (리뷰/숙소/사용자)
- 플랫폼 설정 (수수료율, 약관, 공지사항)

---

## 프로젝트 구조

### Frontend

```
frontend/src/
├── app/
│   └── main.jsx
├── components/
│   ├── accommodation/
│   ├── auth/
│   ├── common/
│   ├── filters/
│   └── search/
├── pages/
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Signup.jsx
│   ├── OAuthCallback.jsx
│   ├── ResultsPage.jsx
│   ├── Accommodation-DetailPage.jsx
│   ├── BusinessLogin.jsx
│   └── BusinessSignup.jsx
├── layouts/
│   ├── DefaultLayout.jsx
│   ├── Header.jsx
│   └── Footer.jsx
├── hooks/
├── contexts/
│   ├── AuthContext.jsx
│   └── HeaderContext.jsx
├── store/
│   └── useBusinessSignupStore.js
├── lib/
│   ├── api/
│   │   ├── client.js
│   │   └── authApi.js
│   └── oauth/
│       ├── oauthConfig.js
│       └── oauthHandler.js
├── utils/
├── constants/
├── data/
├── searchEngine/
├── ui/
├── styles/
└── assets/
```

**라우트 구조:**

```
/                   → Home
/login              → Login
/signup             → Signup
/oauth/callback     → OAuthCallback
/business/login     → BusinessLogin
/business/signup    → BusinessSignup
/domestic           → ResultsPage (국내)
/overseas           → ResultsPage (해외)
/domestic/:id       → AccommodationDetailPage
/overseas/:id       → AccommodationDetailPage
```

---

### Backend

```
backend/src/main/java/com/stay/
├── BackendApplication.java
├── config/
│   ├── DataSourceConfig.java
│   ├── JpaAuditingConfig.java
│   ├── JwtProperties.java
│   ├── OAuthProperties.java
│   ├── WebClientConfig.java
│   ├── WebConfig.java
│   └── security/
│       ├── SecurityConfig.java
│       └── JwtAuthenticationFilter.java
├── controller/
│   ├── HealthController.java
│   └── MemberTestController.java
├── domain/
│   ├── common/
│   │   └── BaseEntity.java
│   ├── auth/
│   │   ├── controller/
│   │   │   ├── AuthController.java
│   │   │   └── OAuthController.java
│   │   ├── service/
│   │   │   ├── AuthService.java
│   │   │   └── OAuthService.java
│   │   ├── dto/
│   │   └── util/
│   │       └── JwtUtil.java
│   └── member/
│       ├── entity/
│       │   ├── Member.java
│       │   ├── BusinessInfo.java
│       │   ├── SocialLogin.java
│       │   ├── EmailVerificationToken.java
│       │   ├── MemberRole.java
│       │   ├── MemberGrade.java
│       │   └── SocialProvider.java
│       ├── repository/
│       ├── service/
│       │   ├── MemberService.java
│       │   ├── BusinessMemberService.java
│       │   ├── EmailVerificationService.java
│       │   └── EmailService.java
│       ├── controller/
│       │   ├── MemberController.java
│       │   ├── BusinessMemberController.java
│       │   └── EmailVerificationController.java
│       ├── dto/
│       └── exception/
│           ├── MemberException.java
│           └── MemberErrorCode.java
└── global/
    └── config/
        └── RedisConfig.java

backend/src/main/resources/
├── application.yml
├── application-dev.yml
└── db/migration/
    ├── V1__create_members_and_social_logins_tables.sql
    ├── V2__add_audit_triggers.sql
    ├── V3__add_nickname_column.sql
    ├── V4__create_business_info_table.sql
    ├── V5__Add_Email_Verification.sql
    ├── V6__modify_password_nullable.sql
    └── V7__add_birth_date_and_gender_to_members.sql
```

---

## 백엔드 아키텍처 원칙

### 도메인 주도 설계 (DDD)

```
Controller (API 엔드포인트)
    ↓
Service (비즈니스 로직)
    ↓
Repository (데이터 접근)
    ↓
Entity (도메인 모델)
```

**패키지 구조:**

```java
domain/
  └── {domain_name}/
      ├── entity/
      ├── repository/
      ├── service/
      ├── controller/
      ├── dto/
      └── exception/
```

**공통 규칙:**

- BaseEntity 상속: createdAt, updatedAt, createdBy, updatedBy
- 조회: `@Transactional(readOnly = true)`
- 변경: `@Transactional`
- 도메인별 커스텀 예외 + 에러 코드 체계화

---

## 기술적 고려사항

### 예약 시스템

- 동시성 제어: 낙관적 잠금(Optimistic Locking) 사용
- 예약 임시 저장 후 일정 시간 내 결제 완료 시 확정
- 취소 가능 기간: 체크인 24시간 전까지
- 결제 실패 시 예약 정보 롤백

### 권한 관리

```
CUSTOMER       — 숙소 조회, 예약, 리뷰 작성
BUSINESS_OWNER — 자기 숙소 관리, 예약 조회, 정산 요청
ADMIN          — 전체 관리, 회원 제재, 통계 조회
```

### 성능 최적화

- 이미지: CDN 연동, 리사이징/압축, Lazy Loading
- 목록: 무한 스크롤 또는 페이지네이션
- DB: 인덱싱 최적화

### 보안

- JWT (HttpOnly Cookie) — XSS 방어
- CORS: 개발 환경 localhost:5173 허용, 프로덕션 도메인 제한 필요
- 결제: PG사 결제창 사용 (카드 정보 직접 저장 금지)

### 백엔드 이관 예정 프론트 로직

| 항목        | 현재 위치                           | 이관 시점                    |
| ----------- | ----------------------------------- | ---------------------------- |
| 검색 엔진   | `src/searchEngine/`                 | Accommodation 도메인 구현 시 |
| 숙소 데이터 | `src/data/accommodations.js` (목업) | Accommodation API 완성 시    |
| 필터링 로직 | `useFilteredAccommodations.js`      | 데이터 증가 시               |

---

## 참고 자료

- [여기어때 서비스](https://www.goodchoice.kr/)
- [React 19 문서](https://react.dev/)
- [TailwindCSS 4 문서](https://tailwindcss.com/)
- [Spring Boot 문서](https://spring.io/projects/spring-boot)
- [Spring Data JPA 문서](https://spring.io/projects/spring-data-jpa)
- [토스페이먼츠 연동 가이드](https://docs.tosspayments.com/)

---

## 변경 이력

- **2025.09.27**: 검색 관용성 개선 완료
- **2025.09.28**: 해외 구글맵 API 적용 완료
- **2025.09.29**: 회원 기능 기초 구현 완료 (사업자 가입 플로우 제외)
- **2025.09.29**: 프로젝트 명세서 업데이트 - 예약 시스템 방향성 확정
- **2025.10.04**: Phase 0 추가 (프로젝트 기초 & 핵심 UI 구축)
- **2025.10.04**: 백엔드 구조 추가 (Member 도메인 완료, DDD 아키텍처 적용)
- **2025.10.04**: 백엔드 예외 처리 개선 (MemberException, MemberErrorCode 체계화)
- **2025.10.21**: 닉네임 기능 추가 (Member Entity, API, 중복 체크, DB 마이그레이션)
- **2025.10.21**: OAuth 로그인 HttpOnly Cookie 방식으로 변경 (보안 강화)
- **2025.10.21**: 프로젝트 명세서 업데이트 (진행 상황 반영, 불필요한 표시 제거)
- **2025.10.28**: HTTP Client: Fetch API → Axios로 수정 (실제 구현과 일치화)
- **2025.10.28**: State Management: Zustand 전환 완료
- **2025.10.28**: DB 테이블 구조 섹션 제거 (Flyway 버전 관리로 대체)
- **2026.06.28**: 명세서 전면 최신화 (Redis 이메일 인증, 사업자 가입 API 연동, JWT 유효기간 정정, 파일 트리 갱신, TODO 문서 분리)
- **2026.06.28**: 명세서 내용 보완 (6.4 매출 관리 원복 및 정산 섹션 추가, Phase 7 통계 대시보드 제거, 정산 구현 수준 표현 수정)
