# Stay 클론 프로젝트 명세서

## 🎯 프로젝트 목표

여기어때 클론 프로젝트 - 숙박 예약 플랫폼 구현

## 🔧 기술 스택

- **Frontend**: React 19, Vite, TailwindCSS 4
- **Backend**: Spring Boot (예정)
- **Database**: MySQL/PostgreSQL (예정)
- **External APIs**: 카카오맵, 구글맵, 소셜 로그인 (구글/네이버/카카오)

---

## 📋 개발 로드맵

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

### ✅ Phase 2: 회원 시스템 기초 (완료)

#### 2.1 인증 시스템 ✅

- 소셜 로그인 (구글/네이버/카카오)
- JWT 기반 인증
- OAuth 콜백 처리

#### 2.2 회원 구분 ✅

- 일반회원과 사업자회원 구분
- 기본 권한 관리
- **⚠️ 사업자 회원 가입 플로우 미구현**

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

- JWT 토큰 만료 시간 관리
- Refresh Token 구현
- CORS 설정

**결제 보안**

- PG사 제공 결제창 사용 (카드 정보 직접 저장 금지)
- PCI-DSS 준수 불필요 (PG사가 처리)
- 결제 검증 로직 서버 측 구현

---

## 🔄 다음 작업 우선순위

### 즉시 착수

1. **사업자 회원 가입 플로우 구현** (Phase 2 완료 필요)
2. **예약 기능 Phase 3.1 시작** (기본 예약 생성)

### 단기 목표

3. 예약 조회 및 내역 (Phase 3.2)
4. 예약 취소 기능 (Phase 3.3)

### 중기 목표

5. 결제 연동 (Phase 3.4)
6. 리뷰 시스템 (Phase 4)

### 장기 목표

7. 회원 등급 및 할인 (Phase 5)
8. 사업자 페이지 (Phase 6)
9. 사이트 관리자 (Phase 7)

---

## 📚 참고 자료

- [여기어때 서비스](https://www.goodchoice.kr/)
- [React 19 문서](https://react.dev/)
- [TailwindCSS 4 문서](https://tailwindcss.com/)
- [PG 결제 연동 가이드](https://docs.tosspayments.com/)

---

## 📝 변경 이력

- **2024.09.27**: 검색 관용성 개선 완료
- **2024.09.28**: 해외 구글맵 API 적용 완료
- **2024.09.29**: 회원 기능 기초 구현 완료 (사업자 가입 플로우 제외)
- **2024.09.29**: 프로젝트 명세서 업데이트 - 예약 시스템 방향성 확정
