# Stay 클론 프로젝트 명세서

## 프로젝트 목표

여기어때 클론 프로젝트 - 숙박 예약 플랫폼 구현

## 기술 스택

- **Frontend**

  - Framework: React 19
  - Build Tool: Vite
  - Styling: TailwindCSS 4
  - Router: React Router v6
  - State Management: Context API(Justand 변경 예정), Custom Hooks
  - HTTP Client: Axios

- **Backend**

  - Framework: Spring Boot 3.5.6
  - Language: Java 17
  - Database: MySQL 8.0
  - ORM: Spring Data JPA (Hibernate)
  - Security: Spring Security + JWT (HttpOnly Cookie)
  - Migration: Flyway

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
- 4단계 회원가입 플로우
- OAuth 콜백 페이지

#### 2.2 백엔드 회원 도메인 (완료)

**엔티티:**

- Member 엔티티
  - 기본 정보: 이메일, 전화번호, 이름, 닉네임
  - 회원 역할 (CUSTOMER, BUSINESS_OWNER, ADMIN)
  - 회원 등급 (BASIC, ELITE, ELITE_PLUS)
  - 예약 횟수, 포인트
  - 활성 상태, 탈퇴일, 마지막 로그인
  - 프로필 이미지 URL
- SocialLogin 엔티티 (소셜 계정 연동)
- MemberRole Enum (역할)
- MemberGrade Enum (등급, 할인율 계산 로직 포함)
- SocialProvider Enum (GOOGLE, NAVER, KAKAO)

**Repository:**

- MemberRepository
  - 기본 조회 (이메일/전화번호/닉네임)
  - 등급별/역할별 조회
  - 통계 쿼리 (활성 회원 수, 등급별 회원 수, 기간별 가입자)
  - 관리자 기능 (회원 검색, 비활성 회원 조회)
- SocialLoginRepository (Fetch Join 최적화)

**Service:**

- MemberService
  - 회원 가입/조회 (활성 회원만)
  - 닉네임 설정/변경/중복 체크
  - 등급 관리 (자동 갱신, 등급 갱신 대상 조회)
  - 포인트 관리 (적립/사용)
  - 회원 탈퇴 (소프트/하드)
  - 사업자 회원 승급
- AuthService (OAuth 로그인 처리, 토큰 재발급)
- OAuthService (구글 OAuth 완료, 카카오/네이버 대기)

**Controller:**

- OAuthController
  - POST `/api/auth/oauth/login` - OAuth 로그인 (HttpOnly 쿠키)
  - POST `/api/auth/oauth/logout` - 로그아웃
  - POST `/api/auth/oauth/refresh` - 토큰 갱신
- MemberController
  - GET `/api/members/me` - 내 정보 조회
  - GET `/api/members/me/points` - 내 포인트 조회
  - GET `/api/members/check-nickname` - 닉네임 중복 체크
  - PATCH `/api/members/{memberId}/nickname` - 닉네임 변경
  - POST `/api/members/upgrade` - 사업자 회원 승급
  - DELETE `/api/members/me` - 회원 탈퇴 (소프트)
  - DELETE `/api/members/me/permanent` - 회원 영구 삭제

**DTO:**

- MemberResponse (회원 정보 응답, 닉네임 포함)
- UpdateNicknameRequest (닉네임 변경 요청)
- NicknameCheckResponse (닉네임 중복 체크 응답)
- OAuthLoginRequest, JwtTokenResponse 등

**예외 처리:**

- MemberException (도메인 예외)
- MemberErrorCode (체계화된 에러 코드)
  - DUPLICATE_NICKNAME (닉네임 중복)
  - MEMBER_NICKNAME_REQUIRED (닉네임 필수)
  - MEMBER_NICKNAME_INVALID_LENGTH (닉네임 길이 오류)
  - MEMBER_NICKNAME_INVALID_FORMAT (닉네임 형식 오류)

**보안:**

- JWT 토큰 (HttpOnly Cookie 방식)
- Access Token (7일) + Refresh Token (30일)
- Spring Security 설정
- JwtAuthenticationFilter (쿠키에서 토큰 추출)

**데이터베이스 마이그레이션:**

- V1: members, social_logins 테이블 생성
- V2: 인덱스 추가
- V3: 닉네임 컬럼 추가 (unique 제약)

#### 2.3 미완성 작업

- 소셜 로그인 (카카오/네이버) 추가
  - OAuthService에 processKakaoLogin, processNaverLogin 메서드 추가
- 사업자 회원 가입 플로우
  - 프론트: 이메일 인증 UI
  - 백엔드: JavaMailSender 연동

---

### Phase 3: 예약 시스템 (진행 예정)

> **결제 정보 수집 방식**: 예약 시점에 결제 정보를 받는 방식으로 진행  
> 회원이 미리 결제 수단을 등록하지 않음 (여기어때 방식 채택)

#### 3.1 기본 예약 생성

- 날짜 선택 UI
- 객실 선택 인터페이스
- 인원 선택
- 예약 정보 임시 저장 (결제 실패 대비)

#### 3.2 예약 조회 및 관리

- 예약 내역 조회
- 예약 상세 정보 표시
- 예약 상태별 필터링

#### 3.3 예약 취소 (사용자 측)

- 취소 가능 기간 체크
- 취소 수수료 계산
- 환불 처리

#### 3.4 결제 연동

- PG사 결제창 연동 (카카오페이, 토스페이 등)
- 결제 성공/실패 처리
- 예약 확정 로직
- 동시성 제어 (같은 객실 중복 예약 방지)

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

#### 4.1 리뷰 작성

- 숙소 이용 후 48시간 이내 작성 가능
- 별점 (1~5) + 텍스트 리뷰
- 이미지 업로드 (선택)

#### 4.2 리뷰 조회

- 숙소별 리뷰 목록
- 평점 평균 계산
- 정렬 (최신순, 평점 높은순, 평점 낮은순)

#### 4.3 리뷰 수정/삭제

- 작성자 본인만 수정/삭제 가능
- 수정 이력 기록

---

### Phase 5: 회원 등급 및 혜택 시스템 (진행 예정)

#### 5.1 회원 등급 체계 (백엔드 완료)

**등급 구조:**

```
Basic (이용횟수 3회 미만)
- 할인율: 0%
- 리뷰 포인트: 최대 2,000P

Elite (이용횟수 3~6회)
- 할인율: 3%
- 리뷰 포인트: 최대 3,000P
- Elite 전용 쿠폰 제공

Elite+ (이용횟수 7회 이상)
- 할인율: 5%
- 리뷰 포인트: 최대 5,000P
- Elite+ 전용 쿠폰 제공
- 우선 상담 서비스 제공
```

**백엔드 완료 사항:**

- MemberGrade Enum (할인율 계산 로직 포함)
- 등급 자동 갱신 로직 (예약 횟수 기반)
- 등급별 할인 금액 계산 메서드
- 다음 등급까지 필요한 예약 횟수 계산

#### 5.2 프론트엔드 연동 (미완성)

- 등급별 UI 표시 (배지, 아이콘)
- 할인 적용된 가격 표시
- 다음 등급까지 남은 예약 횟수 표시
- 등급 혜택 안내 페이지

#### 5.3 등급 혜택 확장 (미완성)

- 쿠폰 지급 시스템
- 포인트 적립률 차등 적용
- Elite 전용 프로모션

#### 5.4 등급 갱신 로직

- 배치 작업 (매달 1일 실행)
- 최근 2년 기준 예약 횟수로 등급 재계산
- 등급 갱신 알림 (이메일/푸시)

---

### Phase 6: 사업자 페이지 구현 (진행 예정)

> **선행 작업 필요**: Phase 2에서 사업자 회원 가입 플로우 먼저 구현

#### 6.1 숙소 관리

- 숙소 등록
  - 기본 정보 (이름, 위치, 카테고리)
  - 이미지 업로드 (최대 20장)
  - 시설 및 편의사항 선택
  - 체크인/체크아웃 규정
- 숙소 수정
- 숙소 삭제

#### 6.2 객실 관리

- 객실 등록 (객실 타입별)
- 객실 정보 수정 (가격, 인원, 시설)
- 객실 삭제
- 객실별 예약 가능 날짜 설정

#### 6.3 예약 관리

- 실시간 예약 현황
  - 오늘/이번 주/이번 달 예약 목록
  - 예약 상태별 필터 (확정/대기/취소)
- 예약 확인/취소 처리
- 고객 특수 요청 확인

#### 6.4 매출 관리

- 수익 대시보드
  - 일/주/월/년 매출 통계
  - 객실별 점유율 분석
  - 평균 숙박 기간 통계
- 정산 내역
  - 플랫폼 수수료 계산
  - 입금 예정일 및 내역

#### 6.5 쿠폰 관리

- 쿠폰 등록 (할인율, 사용 기간)
- 쿠폰 삭제
- 쿠폰 사용 통계

#### 6.6 리뷰 관리

- 고객 리뷰 확인
- 리뷰 답변 작성
- 평점 트렌드 분석

---

### Phase 7: 사이트 관리자 (Admin) (진행 예정)

#### 7.1 회원 관리

- 회원 목록 조회
- 회원 정지/탈퇴 처리
- 사업자 회원 승인 관리

#### 7.2 신고 관리

- 리뷰 신고 처리
- 숙소 신고 처리
- 사용자 신고 처리

#### 7.3 통계 대시보드

- 전체 예약 통계
- 매출 현황
- 회원 가입 추이
- 인기 숙소 분석

#### 7.4 플랫폼 설정

- 수수료율 관리
- 약관 관리
- 공지사항 관리

---

## 프로젝트 구조

### Frontend 주요 디렉토리

```
frontend/src/
├── app/
│   └── main.jsx
│
├── components/
│   ├── accommodation/
│   │
│   ├── auth/
│   │
│   ├── common/
│   │
│   ├── filters/
│   │
│   └── search/
│
├── pages/
│
├── layouts/
│
├── hooks/
│
├── contexts/
│
├── utils/
│
├── constants/
│
├── data/
│
├── searchEngine/
│
├── ui/
│
├── styles/
│
├── assets/
│
├── features/
│
└── lib/
```

---

### Backend 주요 디렉토리

```
backend/src/main/java/com/stay/
├── BackendApplication.java
│
├── config/
│
├── domain/
│   ├── common/
│   │
│   ├── auth/
│   │   ├── controller/
│   │   ├── service/
│   │   ├── dto/
│   │   └── util/
│   │
│   └── member/
│       ├── entity/
│       ├── repository/
│       ├── service/
│       ├── controller/
│       ├── dto/
│       └── exception/
│
└── (향후 추가 예정)
    ├── accommodation/
    ├── reservation/
    ├── review/
    └── payment/

backend/src/main/resources/
├── application.yml
├── application-dev.yml
└── db/migration/
```

---

## 백엔드 아키텍처 원칙

### 1. 도메인 주도 설계 (DDD)

**계층 구조:**

```
Controller (API 엔드포인트)
    ↓
Service (비즈니스 로직)
    ↓
Repository (데이터 접근)
    ↓
Entity (도메인 모델)
```

### 2. 패키지 구조 전략

```java
domain/
  └── {domain_name}/
      ├── entity/           // 엔티티 & Enum
      ├── repository/       // 데이터 접근
      ├── service/          // 비즈니스 로직
      ├── controller/       // API 엔드포인트
      ├── dto/              // 데이터 전송 객체
      └── exception/        // 도메인 예외
```

**장점:**

- 도메인별로 독립적인 개발 가능
- 높은 응집도, 낮은 결합도
- 마이크로서비스 전환 용이

### 3. 공통 규칙

**BaseEntity 상속:**

```java
@MappedSuperclass
public abstract class BaseEntity {
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdBy;
    private String updatedBy;
}
```

**예외 처리 전략:**

- 도메인별 커스텀 예외 사용
- 에러 코드 체계화 (001~999)
- GlobalExceptionHandler로 통합 처리 (추후 구현)

**트랜잭션 전략:**

- 조회: `@Transactional(readOnly = true)` - 성능 최적화
- 변경: `@Transactional` - 데이터 정합성 보장

---

## 기술적 고려사항

### 1. 예약 시스템 구현 시 주의사항

**동시성 제어**

- 같은 객실을 여러 사용자가 동시에 예약 시도할 때 처리
- 낙관적 잠금(Optimistic Locking) 또는 비관적 잠금(Pessimistic Locking) 고려
- 예약 임시 저장 후 일정 시간 내 결제 완료해야 확정

**결제 실패 처리**

- 결제 실패 시 예약 정보 롤백
- 임시 예약 데이터 자동 삭제 (타임아웃 설정)
- 재시도 로직

**취소 정책**

- 취소 가능 기간 체크 (예: 체크인 24시간 전까지)
- 취소 수수료 계산 로직
- 환불 처리 프로세스

### 2. 사업자 시스템 권한 관리

```javascript
const USER_ROLES = {
  CUSTOMER: {
    level: 1,
    permissions: ["view_accommodations", "make_reservation", "write_review"],
  },
  BUSINESS_OWNER: {
    level: 2,
    permissions: [
      "manage_own_accommodations",
      "view_reservations",
      "manage_pricing",
      "view_statistics",
    ],
  },
  ADMIN: {
    level: 3,
    permissions: [
      "manage_all_accommodations",
      "manage_users",
      "view_platform_stats",
      "handle_disputes",
    ],
  },
};
```

### 3. 성능 최적화

**이미지 최적화**

- CDN 연동 필수
- 이미지 리사이징 및 압축
- Lazy Loading 적용

**대용량 데이터 처리**

- 무한 스크롤 또는 페이지네이션
- 검색 결과 캐싱
- 인덱싱 최적화

### 4. 보안

**인증/인가**

- JWT 토큰 기반 인증 (HttpOnly Cookie 방식)
- Access Token (7일) + Refresh Token (30일)
- Spring Security + JwtAuthenticationFilter

**CORS 정책**

```java
// 현재 설정 (개발 환경)
allowedOrigins: http://localhost:5173
allowedMethods: GET, POST, PUT, DELETE, PATCH, OPTIONS
allowCredentials: true

// 프로덕션 환경에서는 도메인 제한 필요
```

**결제 보안**

- PG사 제공 결제창 사용 (카드 정보 직접 저장 금지)
- PCI-DSS 준수 불필요 (PG사가 처리)
- 결제 검증 로직 서버 측 구현

---

## 다음 작업 우선순위

### 즉시 착수 (Phase 2 완성)

1. **소셜 로그인 확장** ✅

   - 카카오 OAuth 연동
   - 네이버 OAuth 연동
   - OAuthService에 provider별 처리 추가

2. **사업자 회원 가입 플로우**
   - 이메일 인증 UI (프론트) ✅
   - JavaMailSender 이메일 발송 (백엔드)

### 단기 목표 (1-2주)

3. **Accommodation 도메인 구현**
   - Accommodation, Room, Image Entity
   - Repository & Service 구현
   - 검색 API (프론트 searchEngine 로직 이관)
   - 필터링 API (프론트 로직 이관)

### 중기 목표 (1개월)

4. **예약 시스템**

   - Reservation 도메인
   - 동시성 제어 (낙관적 잠금)
   - 예약 생성/조회/취소

5. **결제 연동**
   - Payment 도메인
   - 토스페이먼츠 or 카카오페이
   - 결제 검증 로직

### 장기 목표 (2-3개월)

6. 리뷰 시스템 (Phase 4)
7. 회원 등급 & 할인 프론트 연동 (Phase 5)
8. 비즈니스 대시보드 (Phase 6)
9. 어드민 페이지 (Phase 7)

---

## 참고 자료

- [여기어때 서비스](https://www.goodchoice.kr/)
- [React 19 문서](https://react.dev/)
- [TailwindCSS 4 문서](https://tailwindcss.com/)
- [Spring Boot 문서](https://spring.io/projects/spring-boot)
- [Spring Data JPA 문서](https://spring.io/projects/spring-data-jpa)
- [PG 결제 연동 가이드](https://docs.tosspayments.com/)

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
- **2025.10.28**: State Management: Zustand 전환 예정 명시
- **2025.10.28**: DB 테이블 구조 섹션 제거 (Flyway 버전 관리로 대체)
