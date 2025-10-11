import { STORAGE_KEYS } from "@/constants";

/**
 * 토큰 저장소 유틸리티
 *
 * 왜 필요한가?
 * - JWT 토큰을 브라우저에 안전하게 저장하고 관리해야 함
 * - localStorage 사용 (간단하지만 XSS 공격 위험 있음 - 나중에 httpOnly 쿠키로 개선 가능)
 * - 토큰 관련 로직을 한 곳에 모아서 관리 (단일 책임 원칙!)
 */

/**
 * Access Token 저장
 */
export const setAccessToken = (token) => {
  if (!token) {
    console.warn("토큰이 비어있습니다.");
    return;
  }
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
};

/**
 * Access Token 조회
 */
export const getAccessToken = () => {
  return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
};

/**
 * Refresh Token 저장
 */
export const setRefreshToken = (token) => {
  if (!token) {
    console.warn("리프레시 토큰이 비어있습니다.");
    return;
  }
  localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
};

/**
 * Refresh Token 조회
 */
export const getRefreshToken = () => {
  return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
};

/**
 * 모든 토큰 저장 (로그인 성공 시)
 */
export const setTokens = (accessToken, refreshToken) => {
  setAccessToken(accessToken);
  setRefreshToken(refreshToken);
};

/**
 * 모든 토큰 삭제 (로그아웃 시)
 */
export const clearTokens = () => {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
};

/**
 * 로그인 상태 확인
 */
export const isAuthenticated = () => {
  const accessToken = getAccessToken();
  return !!accessToken; // null/undefined면 false, 값이 있으면 true
};

/**
 * 토큰에서 사용자 정보 추출 (JWT Payload 디코딩)
 *
 * JWT 구조: Header.Payload.Signature
 * Payload는 Base64로 인코딩되어 있음
 */
export const getTokenPayload = (token) => {
  if (!token) return null;

  try {
    // JWT를 .으로 분리 (Header, Payload, Signature)
    const parts = token.split(".");
    if (parts.length !== 3) {
      throw new Error("유효하지 않은 토큰 형식입니다.");
    }

    // Payload 부분을 Base64 디코딩
    const payload = parts[1];
    const decodedPayload = atob(payload); // Base64 디코딩
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error("토큰 파싱 실패:", error);
    return null;
  }
};

/**
 * 현재 로그인한 사용자 정보 조회
 */
export const getCurrentUser = () => {
  const token = getAccessToken();
  if (!token) return null;

  const payload = getTokenPayload(token);
  if (!payload) return null;

  // 백엔드에서 넣어준 정보 (JwtUtil 참고)
  return {
    memberId: payload.memberId,
    email: payload.email,
  };
};
