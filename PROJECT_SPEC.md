# Stay 클론 프로젝트 명세서

## 🎯 프로젝트 목표

여기어때 클론 프로젝트 - 숙박 예약 플랫폼 구현

## 🔧 기술 스택

- **Frontend**: React 19, Vite, TailwindCSS 4
- **Backend**: Spring Boot (예정)
- **Database**: MySQL/PostgreSQL (예정)
- **External APIs**: 카카오맵, 소셜 로그인 (구글/네이버/카카오)

## 📋 핵심 기능 명세

### 1. 숙소 예약 시스템

#### 1.1 숙소 검색 및 필터링

- ✅ 국내/해외 숙소 구분
- ✅ 키워드 검색 (숙소명, 지역명)
- ✅ 가격, 카테고리, 시설 필터링
- 📝 정렬 기능 (별점, 리뷰, 가격, 거리순)

#### 1.2 예약 기능

- 📝 국내 숙소: 대실 + 숙박 예약 가능
- 📝 해외 숙소: 숙박 예약만 가능
- 📝 회원만 예약 가능
- 📝 결제 수단 등록 필수

### 2. 회원 시스템

```
일반 회원 (Customer)
├── Basic (이용횟수 3회↓)
├── Elite (이용횟수 3회↑)
└── Elite+ (이용횟수 7회↑)

사업자 회원 (Business)
├── 개인 사업자
│   ├── 민박, 펜션 운영자
│   └── 소규모 숙박업소 (5개 이하)
├── 법인 사업자
│   ├── 호텔 체인
│   ├── 리조트 운영사
│   └── 대규모 숙박업소 (6개 이상)
└── 프리미엄 파트너
    ├── 플래티넘 등급 (월 예약 100건↑)
    ├── 골드 등급 (월 예약 50-99건)
    └── 실버 등급 (월 예약 10-49건)
```

#### 2.1 인증

- 📝 소셜 로그인 (구글/네이버/카카오)
- 📝 JWT 기반 인증

#### 2.2 회원 등급 시스템

```
Basic (이용횟수 3회↓)
├── 기본 혜택: 가입 시 기본등급
├── 등급 혜택:
│   ├── 회원 전용 프로모션 진행
│   └── 리뷰 작성 시 최대 2,000P 지급

Elite (이용횟수 3회↑)
├── 기본 혜택: 최근 2년 내 3번 이상 이용완료 시
├── 등급 혜택:
│   ├── 엘리트 전용 쿠폰 제공
│   ├── 국내 숙소 예약 시 추가 할인
│   ├── 레저·티켓 특별가 제공
│   ├── 회원 전용 프로모션 진행
│   └── 리뷰 작성 시 최대 2,000P 지급

Elite+ (이용횟수 7회↑)
├── 기본 혜택: 최근 2년 내 7번 이상 이용완료 시
├── 등급 혜택:
│   ├── 엘리트 플러스 전용 쿠폰 제공
│   ├── 국내 숙소 예약 시 추가 할인
│   ├── 레저·티켓 특별가 제공
│   ├── 우선 상담 서비스 제공
│   ├── 회원 전용 프로모션 진행
│   └── 리뷰 작성 시 최대 2,000P 지급
```

### 3. 쿠폰 시스템

- 📝 등급별 전용 쿠폰
- 📝 이벤트 조건 만족 시 쿠폰 발급
- 📝 예약 시 쿠폰 할인 적용

### 4. 정렬 기능

- 📝 별점 높은순
- 📝 리뷰 많은순
- 📝 높은 가격순
- 📝 낮은 가격순
- 📝 거리순

### 5. 사업자 전용 기능

#### 5.1 숙소 관리 시스템

- 📝 **숙소 등록/수정**
  - 기본 정보 (이름, 위치, 카테고리)
  - 이미지 업로드 (최대 20장)
  - 객실 정보 및 가격 설정
  - 시설 및 편의사항 선택
  - 체크인/체크아웃 규정

#### 5.2 예약 관리 시스템

- 📝 **실시간 예약 현황**

  - 오늘/이번 주/이번 달 예약 목록
  - 예약 상태 관리 (확정/대기/취소)
  - 고객 문의 및 특수 요청 처리

- 📝 **캘린더 관리**

  - 객실별 예약 가능 날짜 설정
  - 성수기/비수기 가격 조정
  - 임시 휴업/보수 기간 설정

#### 5.3 매출 관리 및 통계

- 📝 **수익 대시보드**

  - 일/주/월/년 매출 통계
  - 객실별 점유율 분석
  - 평균 숙박 기간 및 고객 유형 분석

- 📝 **정산 관리**

  - 플랫폼 수수료 내역
  - 세금계산서 발행
  - 입금 예정일 및 내역

#### 5.4 고객 관리 (CRM)

- 📝 **리뷰 관리**

  - 고객 리뷰 확인 및 답변
  - 평점 트렌드 분석
  - 개선 사항 도출

## 🗂️ 프로젝트 구조

### 전체 구조

```
프로젝트루트/
├── README.md                    # 프로젝트 개요
├── PROJECT_SPEC.md              # 프로젝트 명세서
├── .gitignore                   # Git 무시 파일 설정
├── eslint.config.js             # ESLint 설정
├── backend/                     # Spring Boot 백엔드 (예정)
│   └── backend.md
└── frontend/                    # React 프론트엔드
    ├── package.json             # 의존성 관리
    ├── vite.config.js           # Vite 설정 및 alias
    ├── index.html               # HTML 진입점
    └── src/                     # 소스 코드
```

### Frontend 구조 상세

```
frontend/src/
├── app/                         # 앱 설정
│   └── main.jsx                 # 라우터 설정 및 앱 진입점
├── components/                  # 재사용 컴포넌트
│   ├── common/                  # 공통 컴포넌트
│   │   ├── KakaoMap.jsx         # 카카오맵 통합
│   │   └── SocialLoginBtn.jsx   # 소셜 로그인 버튼
│   ├── search/                  # 검색 관련 컴포넌트
│   │   ├── SearchForm.jsx       # 검색 폼
│   │   ├── SummaryBar.jsx       # 헤더 검색 요약
│   │   ├── ExpandedHeaderSearch.jsx  # 확장 검색 헤더
│   │   └── GuestsPopover.jsx    # 인원 선택 팝오버
│   ├── accommodation/           # 숙소 관련 컴포넌트
│   │   ├── AccommodationCard.jsx     # 숙소 카드
│   │   ├── AmenitiyModal.jsx         # 시설 정보 모달
│   │   ├── HotAccommodation.jsx      # 인기 숙소 섹션
│   │   ├── HotPoint.jsx              # 인기 여행지 섹션
│   │   ├── ResultHeader.jsx          # 검색 결과 헤더
│   │   ├── ResultList.jsx            # 검색 결과 리스트
│   │   └── SortBar.jsx               # 정렬 바
│   ├── filters/                 # 필터 관련 컴포넌트
│   │   ├── index.jsx            # 필터 메인 컴포넌트
│   │   ├── CategoryFilter.jsx   # 카테고리 필터
│   │   ├── PriceFilter.jsx      # 가격 범위 필터
│   │   └── AmenitiesFilter.jsx  # 시설 필터
│   ├── business/                # 사업자 전용 컴포넌트 (예정)
│   │   ├── Dashboard.jsx        # 사업자 대시보드
│   │   ├── AccommodationManager.jsx  # 숙소 관리
│   │   ├── ReservationManager.jsx    # 예약 관리
│   │   └── Statistics.jsx       # 통계 컴포넌트
│   └── ui/                      # UI 컴포넌트
│       └── Event.jsx            # 이벤트 배너
├── pages/                       # 페이지 컴포넌트
│   ├── customer/                # 일반 고객용 페이지
│   │   ├── Home.jsx             # 홈페이지
│   │   ├── ResultsPage.jsx      # 검색 결과 페이지
│   │   └── Accommodation-DetailPage.jsx  # 숙소 상세 페이지
│   ├── business/                # 사업자용 페이지 (예정)
│   │   ├── BusinessDashboard.jsx    # 사업자 대시보드
│   │   ├── AccommodationManagement.jsx  # 숙소 관리
│   │   └── ReservationManagement.jsx    # 예약 관리
│   ├── Login.jsx                # 로그인 페이지
│   └── OAuthCallback.jsx        # OAuth 콜백 처리
├── layouts/                     # 레이아웃 컴포넌트
│   ├── DefaultLayout.jsx        # 기본 레이아웃
│   ├── BusinessLayout.jsx       # 사업자 전용 레이아웃 (예정)
│   ├── Header.jsx               # 헤더 컴포넌트
│   └── Footer.jsx               # 푸터 컴포넌트
├── hooks/                       # 커스텀 훅
│   ├── useHomeSearchState.js    # 홈 검색 상태 관리
│   ├── useFilteredAccommodations.js  # 필터된 숙소 관리
│   ├── useResultsHeader.js      # 결과 페이지 헤더 관리
│   ├── useFilterParams.js       # URL 필터 파라미터 관리
│   └── useAuth.js               # 인증 상태 관리 (예정)
├── contexts/                    # Context API
│   ├── HeaderContext.jsx        # 헤더 상태 전역 관리
│   └── AuthContext.jsx          # 인증 상태 전역 관리 (예정)
├── utils/                       # 유틸리티 함수
│   ├── dateText.js              # 날짜 포맷팅 유틸
│   ├── searchUtils.js           # 검색 로직 유틸
│   └── auth.js                  # 인증 관련 유틸 (예정)
├── constants/                   # 상수 정의
│   ├── filters.js               # 필터 관련 상수
│   └── userRoles.js             # 사용자 권한 상수 (예정)
├── data/                        # 임시 데이터
│   └── accommodations.js        # 숙소 목업 데이터
├── styles/                      # 스타일 파일
│   ├── globals.css              # 전역 스타일 (TailwindCSS 포함)
│   └── App.css                  # 앱별 스타일
├── assets/                      # 정적 자원
│   └── react.svg
├── features/                    # 기능별 모듈 (향후 확장용)
│   └── .gitkeep
└── lib/                         # 라이브러리 설정 (향후 확장용)
    └── .gitkeep
```

### 아키텍처 설계 원칙

#### 1. 컴포넌트 분리 전략

- **도메인별 분리**: `accommodation/`, `search/`, `filters/`, `business/` 등 기능별 폴더 구성
- **레이어별 분리**: `components/`, `pages/`, `layouts/` 등 책임별 구분
- **사용자 타입별 분리**: `pages/customer/`, `pages/business/` 등 권한별 구분
- **재사용성 고려**: `common/`, `ui/` 폴더의 공통 컴포넌트

#### 2. 상태 관리 전략

- **로컬 상태**: `useState`, `useReducer` 활용
- **전역 상태**: Context API (`HeaderContext`, `AuthContext`) 사용
- **URL 상태**: 검색 및 필터 파라미터를 URL에서 관리
- **커스텀 훅**: 비즈니스 로직을 훅으로 분리

#### 3. 코드 조직화

- **Path Alias**: `@/`, `@components/`, `@pages/` 등으로 import 간소화
- **기능별 폴더링**: 관련 컴포넌트들을 도메인별로 그룹화
- **유틸리티 분리**: 재사용 가능한 로직을 `utils/`에서 관리

### 📝 다음 단계 작업 계획

#### 초기 작업

1. **상세 페이지 완성**

   - 시설 정보 데이터 구조 정의
   - 객실 이미지 갤러리 추가
   - 예약 버튼 인터랙션 개선

2. **UX 개선**

   - 로딩 상태 표시 (스켈레톤 UI)
   - 에러 처리 및 폴백 UI
   - 이미지 최적화 (lazy loading)

3. **정렬 기능 구현**

   - 별점 높은순
   - 리뷰 많은순
   - 낮은/높은 가격순
   - 거리순 (카카오맵 API 활용)

#### 중기 작업

1. **소셜 로그인 연동**

   - OAuth 플로우 구현
   - JWT 토큰 관리
   - 로그인 상태 관리

2. **회원 시스템 기초**

   - 일반회원/사업자 회원 구분
   - 회원가입 시 사용자 타입 선택
   - 기본 권한 관리 시스템

3. **리뷰 시스템 완성**

   - 리뷰 목록 표시 컴포넌트
   - 평점 평균 계산 및 표시
   - 리뷰 필터링 (최신순, 평점순)

#### 장기 작업

1. **API 연동 준비**

   - API 클라이언트 구조 설계
   - 에러 핸들링 표준화
   - 로딩 상태 관리 개선

2. **사업자 기본 기능**

   - 사업자 전용 레이아웃
   - 숙소 등록 시스템 (기본 정보)
   - 간단한 예약 관리

3. **사업자 고급 기능**

   - 매출 대시보드
   - 통계 및 분석 도구
   - 마케팅 도구

4. **회원 시스템**

   - 등급별 혜택 차별화
   - 쿠폰 시스템 적용
   - 마이페이지 구현

5. **예약 시스템 구현**

   - 예약 프로세스 UI
   - 결제 인터페이스 연동
   - 예약 확인 및 관리

## 🔧 기술적 고려사항

### 사업자 시스템 구현 시

#### 1. 권한 관리

```javascript
// 권한 구조 예시
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

#### 2. 아키텍처 확장

- **Frontend 구조 확장**: 사업자 전용 컴포넌트 및 페이지 분리
- **상태 관리 복잡성**: 다중 사용자 타입 지원, 권한별 화면 렌더링
- **보안 강화**: JWT 기반 역할별 인증, API 엔드포인트 권한 검증

#### 3. 성능 최적화

- **이미지 업로드**: CDN 연동 필수
- **실시간 데이터**: WebSocket 또는 Server-Sent Events
- **대용량 통계**: 백그라운드 배치 처리

### 리뷰 시스템 구현 시

- **별점 컴포넌트**: 커스텀 Star Rating 컴포넌트 구현
- **폼 밸리데이션**: 리뷰 내용 최소/최대 길이 검증
- **상태 관리**: 리뷰 작성 상태를 로컬 스토리지에 임시 저장
- **UX**: 작성 중 페이지 이탈 방지 확인 모달

### 시설 정보 연동 시

- **데이터 구조**: 시설별 카테고리와 아이콘 매핑
- **확장성**: 새로운 시설 추가 시 쉽게 확장 가능한 구조
- **접근성**: 시설 정보의 스크린리더 지원
- **성능**: 시설 아이콘 이미지 최적화

## 🔄 현재 작업 중인 이슈

1. 평점 및 리뷰 작성 기능 구현
2. 디테일 페이지 내 서비스 및 부대시설 모달 숙소 정보와 연동

## 📚 참고 자료

- [여기어때 서비스](https://www.goodchoice.kr/)
- [React 19 문서](https://react.dev/)
- [TailwindCSS 4 문서](https://tailwindcss.com/)
