# Stay 클론 프로젝트 명세서

## 🎯 프로젝트 목표

여기어때 클론 프로젝트 - 숙박 예약 플랫폼 구현

## 🔧 기술 스택

- **Frontend**: React 19, Vite, TailwindCSS 4
- **Backend**: Spring Boot 3.5.6, Java 17, Spring Data JPA
- **Database**: MySQL
- **External APIs**: 카카오맵, 구글맵, 소셜 로그인 (구글/네이버/카카오)

---

## 📊 프로젝트 진행 현황

- **프론트엔드**: 약 53% 완료 (Phase 0~2)
- **백엔드**: 약 10% 완료 (Member 도메인)
- **다음 목표**: OAuth 연동 → 숙소 검색 API

---

✅ 완료 | 📋 작업 예정

## 📋 개발 로드맵

### ✅ Phase 0: 프로젝트 기초 & 핵심 UI 구축 (완료)

#### 0.1 프로젝트 설정 ✅

- Vite + React 19 초기 설정
- TailwindCSS 4 설정
- React Router 설정
- 폴더 구조 설계

#### 0.2 레이아웃 시스템 ✅

- 헤더/푸터 레이아웃
- 검색 모드 & 디테일 모드 헤더
- HeaderContext 상태 관리

#### 0.3 핵심 페이지 구성 ✅

- **홈 페이지**: 메인 검색, 인기 숙소, 이벤트
- **검색 결과 페이지**: 필터링, 정렬, 카드 리스트
- **숙소 상세 페이지**: 갤러리, 객실 선택, 예약 UI
- **로그인/회원가입 페이지**: 소셜 로그인, 4단계 회원가입

#### 0.4 재사용 컴포넌트 라이브러리 ✅

- 숙소 관련 컴포넌트 (카드, 리스트, 정렬 등)
- 검색 관련 컴포넌트 (폼, 팝오버, 요약 바)
- 필터 컴포넌트 (가격, 편의시설, 카테고리)
- 인증 컴포넌트 (소셜 로그인, 회원가입 스텝)

#### 0.5 Hooks & Utils ✅

- 커스텀 훅 (파라미터, 필터링, 상태 관리)
- 유틸리티 함수 (날짜, 지역명, 검색)

#### 0.6 목업 데이터 ✅

- 국내 숙소 10개
- 해외 숙소 10개
- 필터 상수 정의

---

### ✅ Phase 1: 검색 및 지도 연동 (완료)

#### 1.1 검색 관용성 개선 ✅

- 국내 지역명 별칭 처리 (제주 → 제주도)
- 공백 무시 검색
- 키워드 정규화 및 매칭 점수 시스템
- 구현 위치: `frontend/src/searchEngine/`

#### 1.2 해외 숙소 구글맵 API 적용 ✅

- 해외 숙소의 경우 구글맵으로 위치 표시
- 국내 숙소는 기존 카카오맵 유지
- 지도 API 자동 선택 로직

---

### ✅ Phase 2: 회원 시스템 기초 (80% 완료)

#### 2.1 프론트엔드 인증 UI ✅

- 소셜 로그인 버튼 (구글/네이버/카카오)
- 4단계 회원가입 플로우
- OAuth 콜백 페이지

#### 2.2 백엔드 회원 도메인 ✅

- Member 엔티티 (회원 정보, 등급, 포인트)
- SocialLogin 엔티티 (소셜 계정 연동)
- MemberRepository (복잡한 쿼리 포함)
- MemberService (가입, 조회, 등급/포인트 관리)
- 커스텀 예외 처리 (MemberException, MemberErrorCode)

#### 2.3 미완성 작업 ⚠️

- **OAuth Controller** (JWT 발급) - 최우선 작업
- **사업자 회원 가입 플로우**

---

### 📝 Phase 3: 예약 시스템 구현 (진행 예정)

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
- **⚠️ 동시성 제어 필수** (같은 객실 중복 예약 방지)

**예약 플로우:**

```
예약 페이지 (날짜/인원 선택)
    ↓
예약 확인 페이지 (가격 확인)
    ↓
결제 페이지 (← 여기서 결제 정보 입력)
    ↓
PG사 결제창 호출
    ↓
결제 결과 처리
    ↓
예약 완료/실패
```

---

### 📝 Phase 4: 리뷰 시스템 (예약 후)

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

### 📝 Phase 5: 회원 등급 및 혜택 시스템

#### 5.1 회원 등급 체계

**일반 회원 (Customer)**

```
Basic (이용횟수 3회 미만)
├── 기본 혜택
│   ├── 회원 전용 프로모션 참여
│   └── 리뷰 작성 시 최대 2,000P 지급
│
Elite (이용횟수 3~6회)
├── Basic 혜택 +
│   ├── Elite 전용 쿠폰 제공
│   ├── 국내 숙소 예약 시 추가 할인
│   └── 레저·티켓 특별가 제공
│
Elite+ (이용횟수 7회 이상)
├── Elite 혜택 +
│   ├── Elite+ 전용 쿠폰 제공
│   └── 우선 상담 서비스 제공
```

#### 5.2 등급별 할인 구현

- 예약 가격 계산 시 등급별 할인율 적용
- 쿠폰과 중복 적용 가능 여부 정책 수립
- 등급 갱신 로직 (최근 2년 기준)

---

### 📝 Phase 6: 사업자 페이지 구현

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

### 📝 Phase 7: 사이트 관리자 (Admin)

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

## 🗂️ 프로젝트 구조

### Frontend 주요 디렉토리

```
frontend/src/
├── app/                         # 앱 진입점 및 라우터
│   ├── App.jsx                  # 앱 컴포넌트
│   └── main.jsx                 # 라우터 설정 및 진입점
│
├── components/                  # 재사용 컴포넌트
│   ├── accommodation/           # 숙소 관련 컴포넌트
│   │   ├── AccommodationCard.jsx
│   │   ├── AmenitiyModal.jsx
│   │   ├── DateRangeField.jsx
│   │   ├── HotAccommodation.jsx
│   │   ├── HotPoint.jsx
│   │   ├── ResultHeader.jsx
│   │   ├── ResultList.jsx
│   │   └── SortBar.jsx
│   │
│   ├── auth/                    # 인증 관련 컴포넌트
│   │   ├── PhoneVerificationStep.jsx
│   │   ├── SignupCompleteStep.jsx
│   │   ├── SocialLoginBtn.jsx
│   │   ├── TermsAgreementStep.jsx
│   │   └── UserInfoStep.jsx
│   │
│   ├── common/                  # 공통 컴포넌트
│   │   ├── GoogleMap.jsx
│   │   ├── KakaoMap.jsx
│   │   └── MapContainer.jsx
│   │
│   ├── filters/                 # 필터 관련 컴포넌트
│   │   ├── index.jsx
│   │   ├── AmenitiesFilter.jsx
│   │   ├── CategoryFilter.jsx
│   │   └── PriceFilter.jsx
│   │
│   └── search/                  # 검색 관련 컴포넌트
│       ├── BookingPopover.jsx
│       ├── ExpandedHeaderSearch.jsx
│       ├── SearchForm.jsx
│       └── SummaryBar.jsx
│
├── pages/                       # 페이지 컴포넌트
│   ├── Accommodation-DetailPage.jsx
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── OAuthCallback.jsx
│   ├── ResultsPage.jsx
│   └── Signup.jsx
│
├── layouts/                     # 레이아웃 컴포넌트
│   ├── DefaultLayout.jsx
│   ├── Footer.jsx
│   └── Header.jsx
│
├── hooks/                       # 커스텀 훅
│   ├── useAccommodationParams.js
│   ├── useFilteredAccommodations.js
│   ├── useFilterParams.js
│   ├── useHomeSearchState.js
│   └── useResultsHeader.js
│
├── contexts/                    # Context API
│   └── HeaderContext.jsx
│
├── utils/                       # 유틸리티 함수
│   ├── dateText.js
│   ├── locationAliases.js
│   └── searchUtils.js
│
├── constants/                   # 상수 정의
│   └── filters.js
│
├── data/                        # 임시 데이터 (목업)
│   └── accommodations.js
│
├── searchEngine/                # 검색 엔진 모듈
│   ├── index.js                 # 진입점
│   ├── searchEngine.js          # 메인 검색 로직
│   ├── scoringEngine.js         # 점수 계산 엔진
│   ├── aliasResolver.js         # 지역명 별칭 처리
│   ├── textNormalizer.js        # 텍스트 정규화
│   └── constants.js             # 검색 관련 상수
│
├── ui/                          # UI 컴포넌트
│   └── Event.jsx
│
├── styles/                      # 스타일 파일
│   ├── App.css
│   └── globals.css
│
├── assets/                      # 정적 자원
│   └── react.svg
│
├── features/                    # 기능별 모듈 (향후 확장용)
│   └── .gitkeep
│
└── lib/                         # 라이브러리 설정 (향후 확장용)
    └── .gitkeep
```

---

### Backend 주요 디렉토리

```
backend/src/main/java/com/stay/
├── BackendApplication.java      # Spring Boot 진입점
│
├── config/                       # 설정 클래스
│   ├── WebConfig.java           # CORS, MVC 설정
│   └── JpaAuditingConfig.java   # JPA Auditing 설정
│
├── controller/                   # REST API 컨트롤러
│   └── HealthController.java    # 헬스체크 API
│
├── domain/                       # 도메인별 패키지 (DDD 방식)
│   │
│   ├── common/                   # 공통 엔티티
│   │   └── BaseEntity.java      # 생성일시, 수정일시 등 공통 필드
│   │
│   └── member/                   # 회원 도메인
│       ├── entity/               # 엔티티 클래스
│       │   ├── Member.java      # 회원 엔티티
│       │   ├── SocialLogin.java # 소셜 로그인 정보
│       │   ├── MemberRole.java  # 회원 역할 Enum (CUSTOMER, BUSINESS_OWNER, ADMIN)
│       │   ├── MemberGrade.java # 회원 등급 Enum (BASIC, ELITE, ELITE+)
│       │   └── SocialProvider.java # 소셜 제공자 Enum (GOOGLE, NAVER, KAKAO)
│       │
│       ├── repository/           # JPA 리포지토리
│       │   ├── MemberRepository.java
│       │   └── SocialLoginRepository.java
│       │
│       ├── service/              # 비즈니스 로직
│       │   └── MemberService.java
│       │
│       └── exception/            # 도메인 예외
│           ├── MemberException.java
│           └── MemberErrorCode.java
│
└── (향후 추가 예정)
    ├── accommodation/            # 숙소 도메인 (계획 중)
    ├── reservation/              # 예약 도메인 (계획 중)
    ├── review/                   # 리뷰 도메인 (계획 중)
    └── payment/                  # 결제 도메인 (계획 중)

backend/src/main/resources/
├── application.yml               # 기본 설정
└── application-dev.yml          # 개발 환경 설정 (git 제외)

backend/build.gradle              # Gradle 빌드 설정
```

---

## 🏗️ 백엔드 아키텍처 원칙

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
  └── {domain_name}/        // 도메인별로 완전히 분리
      ├── entity/           // 엔티티 & Enum
      ├── repository/       // 데이터 접근
      ├── service/          // 비즈니스 로직
      ├── controller/       // API 엔드포인트 (추후 추가)
      ├── dto/              // 데이터 전송 객체 (추후 추가)
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
    private LocalDateTime createdAt;   // 생성일시
    private LocalDateTime updatedAt;   // 수정일시
    private String createdBy;          // 생성자
    private String updatedBy;          // 수정자
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

## 🗄️ 데이터베이스 스키마

### 현재 구현된 테이블

**members** (회원)

```sql
CREATE TABLE members (
    member_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone_number VARCHAR(20),
    name VARCHAR(50) NOT NULL,
    role VARCHAR(20) NOT NULL,           -- CUSTOMER, BUSINESS_OWNER, ADMIN
    grade VARCHAR(20) NOT NULL,          -- BASIC, ELITE, ELITE_PLUS
    reservation_count INT DEFAULT 0,
    points INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    last_grade_updated_at DATETIME,
    deleted_at DATETIME,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    created_by VARCHAR(50),
    updated_by VARCHAR(50),
    INDEX idx_email (email),
    INDEX idx_phone (phone_number)
);
```

**social_logins** (소셜 로그인 정보)

```sql
CREATE TABLE social_logins (
    social_login_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    member_id BIGINT NOT NULL,
    provider VARCHAR(20) NOT NULL,       -- GOOGLE, NAVER, KAKAO
    social_id VARCHAR(100) NOT NULL,
    social_email VARCHAR(100),
    social_name VARCHAR(100),
    profile_image_url VARCHAR(500),
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    created_by VARCHAR(50),
    updated_by VARCHAR(50),
    FOREIGN KEY (member_id) REFERENCES members(member_id),
    UNIQUE KEY uk_provider_social_id (provider, social_id),
    INDEX idx_member_id (member_id),
    INDEX idx_provider_social_id (provider, social_id)
);
```

### 향후 추가될 테이블 (계획)

- `accommodations` (숙소)
- `rooms` (객실)
- `reservations` (예약)
- `reviews` (리뷰)
- `payments` (결제)
- `images` (이미지)
- `coupons` (쿠폰)
- ... (Phase별로 추가)

---

## 🔧 기술적 고려사항

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

- JWT 토큰 기반 인증 (구현 예정)
- Access Token + Refresh Token 방식
- Authorization 헤더: `Bearer {token}`

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

## 📋 백엔드 구현 상태

### ✅ 완료 (Member 도메인)

```
✅ Entity
   - Member (회원)
   - SocialLogin (소셜 로그인 정보)
   - MemberRole (역할)
   - MemberGrade (등급)
   - SocialProvider (소셜 제공자)

✅ Repository
   - MemberRepository (복잡한 쿼리 포함)
   - SocialLoginRepository (Fetch Join 최적화)

✅ Service
   - MemberService (회원가입, 조회, 등급 관리, 포인트 관리)

✅ Exception
   - MemberException
   - MemberErrorCode (체계화된 에러 코드)

✅ Config
   - WebConfig (CORS)
   - JpaAuditingConfig (생성/수정 정보 자동 관리)
```

### 🔜 다음 작업

**1. OAuth & Security**

```
- OAuthController (OAuth 콜백 처리)
- TokenService (JWT 발급/검증)
- SecurityConfig (Spring Security 설정)
```

**2. Accommodation 도메인**

```
- Accommodation Entity
- AccommodationRepository
- AccommodationService
- 검색 API 구현 (프론트 searchEngine 로직 이관)
```

**3. Image 도메인**

```
- Image Entity
- ImageService (S3 업로드)
- 이미지 관리 API
```

---

## 🔄 다음 작업 우선순위

### 백엔드 즉시 착수

1. **OAuth Controller 구현** - 프론트 Phase 2 완성
2. **Accommodation API** - 프론트 Phase 3 시작 가능

### 프론트엔드 단기 목표

3. **사업자 회원 가입 플로우** (Phase 2 완료)
4. **예약 기능 Phase 3.1** (기본 예약 생성)

### 중기 목표

5. 예약 조회 및 내역 (Phase 3.2)
6. 예약 취소 기능 (Phase 3.3)
7. 결제 연동 (Phase 3.4)

### 장기 목표

8. 리뷰 시스템 (Phase 4)
9. 회원 등급 및 할인 (Phase 5)
10. 사업자 페이지 (Phase 6)
11. 사이트 관리자 (Phase 7)

---

## 📚 참고 자료

- [여기어때 서비스](https://www.goodchoice.kr/)
- [React 19 문서](https://react.dev/)
- [TailwindCSS 4 문서](https://tailwindcss.com/)
- [Spring Boot 문서](https://spring.io/projects/spring-boot)
- [Spring Data JPA 문서](https://spring.io/projects/spring-data-jpa)
- [PG 결제 연동 가이드](https://docs.tosspayments.com/)

---

## 📝 변경 이력

- **2025.09.27**: 검색 관용성 개선 완료
- **2025.09.28**: 해외 구글맵 API 적용 완료
- **2025.09.29**: 회원 기능 기초 구현 완료 (사업자 가입 플로우 제외)
- **2025.09.29**: 프로젝트 명세서 업데이트 - 예약 시스템 방향성 확정
- **2025.10.04**: Phase 0 추가 (프로젝트 기초 & 핵심 UI 구축)
- **2025.10.04**: 백엔드 구조 추가 (Member 도메인 완료, DDD 아키텍처 적용)
- **2025.10.04**: 백엔드 예외 처리 개선 (MemberException, MemberErrorCode 체계화)
