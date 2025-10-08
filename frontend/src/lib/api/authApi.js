import apiClient from "./client";
import { setTokens, clearTokens } from "@/lib/utils/tokenStorage";

/**
 * 인증 API 모듈
 */

const authApi = {
  /**
   * OAuth 로그인 (백엔드 처리 방식) ⭐ 권장
   */
  oauthLogin: async (loginData) => {
    try {
      const response = await apiClient.post("/auth/oauth/login", loginData);

      const { accessToken, refreshToken } = response.data;

      // 토큰 저장 (localStorage)
      setTokens(accessToken, refreshToken);

      return response.data;
    } catch (error) {
      console.error("OAuth 로그인 실패:", error);

      // 에러 메시지 가공
      const errorMessage =
        error.response?.data?.message || "OAuth 로그인에 실패했습니다.";
      throw new Error(errorMessage);
    }
  },

  /**
   * 소셜 로그인 (프론트엔드 처리 방식) - 호환용
   *
   * @deprecated oauthLogin 사용 권장
   */
  login: async (loginData) => {
    try {
      const response = await apiClient.post("/auth/login", loginData);

      const { accessToken, refreshToken } = response.data;

      // 토큰 저장 (localStorage)
      setTokens(accessToken, refreshToken);

      return response.data;
    } catch (error) {
      console.error("로그인 실패:", error);

      // 에러 메시지 가공
      const errorMessage =
        error.response?.data?.message || "로그인에 실패했습니다.";
      throw new Error(errorMessage);
    }
  },

  /**
   * 로그아웃
   */
  logout: async () => {
    try {
      // TODO: 백엔드에 로그아웃 API 호출 (Refresh Token 삭제)
      // await apiClient.post('/auth/logout');

      // 토큰 삭제
      clearTokens();

      return { success: true };
    } catch (error) {
      console.error("로그아웃 실패:", error);

      // 에러가 나도 토큰은 삭제
      clearTokens();

      throw error;
    }
  },

  /**
   * Access Token 재발급
   */
  refresh: async (refreshToken) => {
    try {
      const response = await apiClient.post("/auth/refresh", {
        refreshToken,
      });

      const { accessToken, refreshToken: newRefreshToken } = response.data;

      // 새 토큰 저장
      setTokens(accessToken, newRefreshToken);

      return response.data;
    } catch (error) {
      console.error("토큰 재발급 실패:", error);

      // 재발급 실패 시 로그아웃 처리
      clearTokens();

      throw error;
    }
  },

  /**
   * 현재 사용자 정보 조회 (예시)
   */
  getCurrentUser: async () => {
    try {
      // TODO: 백엔드 API 구현 후 주석 해제
      // const response = await apiClient.get('/auth/me');
      // return response.data;

      // 임시로 localStorage에서 토큰 파싱
      const { getCurrentUser } = await import("@/lib/utils/tokenStorage");
      return getCurrentUser();
    } catch (error) {
      console.error("사용자 정보 조회 실패:", error);
      throw error;
    }
  },
};

export default authApi;
