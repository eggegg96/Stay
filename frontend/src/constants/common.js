// ==================== 날짜 관련 상수 ====================

/**
 * 날짜 계산용 상수
 *
 * 사용 위치:
 * - Header.jsx (체크아웃 날짜 계산)
 * - 향후 예약, 캘린더 등에서 사용 예정
 */
export const DATE_CONSTANTS = {
  ONE_DAY_MS: 24 * 60 * 60 * 1000, // 1일 (밀리초)
  ONE_HOUR_MS: 60 * 60 * 1000, // 1시간 (밀리초)
  DEFAULT_NIGHTS: 1, // 기본 숙박 일수
};

// ==================== API 관련 상수 ====================

/**
 * API 타임아웃 설정
 *
 * 왜 이 시간들인가?
 * - DEFAULT (5초): 일반적인 API 응답 시간 (DB 조회, 간단한 처리)
 * - UPLOAD (15초): 이미지 업로드 등 파일 전송 시간
 * - OAUTH (10초): OAuth 토큰 교환은 외부 API 통신이라 조금 여유있게
 */
export const API_TIMEOUT = {
  DEFAULT: 5 * 1000, // 5초 (일반 API)
  UPLOAD: 15 * 1000, // 15초 (파일 업로드)
  OAUTH: 10 * 1000, // 10초 (OAuth 처리)
};

/**
 * UI 전환 딜레이 설정
 *
 * 왜 필요한가?
 * - 사용자가 로딩 상태를 인지할 수 있도록 최소 시간 보장
 * - 너무 빠르면 화면이 깜빡여서 불편함
 */
export const UI_DELAY = {
  REDIRECT: 1500, // 1.5초 (페이지 리다이렉트 전 대기)
  TOAST: 3000, // 3초 (토스트 메시지 표시 시간)
  LOADING_MIN: 500, // 0.5초 (최소 로딩 표시 시간)
};

/**
 * 인증 관련 상수
 */
export const AUTH = {
  TOKEN_REFRESH_MARGIN: 5 * 60 * 1000, // 5분 (토큰 만료 5분 전에 갱신)
};

/**
 * 유효성 검사
 */
export const VALIDATION = {
  USERNAME_MIN_LENGTH: 2,
  USERNAME_MAX_LENGTH: 20,
  PASSWORD_MIN_LENGTH: 8,
  PHONE_LENGTH: 11,
};
