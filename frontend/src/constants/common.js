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

// ==================== 로컬 스토리지 키 ====================

/**
 * 로컬 스토리지 키 상수
 *
 * 사용 위치:
 * - lib/utils/tokenStorage.js
 * - lib/api/client.js
 * - contexts/AuthContext.jsx (만들 예정)
 */
export const STORAGE_KEYS = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  USER_INFO: "userInfo",
};

// ==================== API 관련 상수 ====================

/**
 * API 타임아웃 설정 (밀리초)
 *
 * 사용 위치:
 * - lib/api/client.js
 */
export const API_TIMEOUT = {
  DEFAULT: 10 * 1000, // 10초
  UPLOAD: 30 * 1000, // 30초 (나중에 파일 업로드 시 사용)
};
