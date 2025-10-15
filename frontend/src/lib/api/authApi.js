import apiClient from "./client";

/**
 * 인증 API 모듈
 */

const authApi = {
  /**
   * OAuth 로그인 (백엔드 처리 방식)
   */
  oauthLogin: async (loginData) => {
    try {
      const response = await apiClient.post("/auth/oauth/login", loginData);

      return response.data;
    } catch (error) {
      console.error("OAuth 로그인 실패:", error);

      const errorMessage =
        error.response?.data?.message || "OAuth 로그인에 실패했습니다.";
      throw new Error(errorMessage);
    }
  },

  /**
   * 소셜 로그인 (프론트엔드 처리 방식) - 호환용
   * @deprecated oauthLogin 사용 권장
   */

  login: async (loginData) => {
    try {
      const response = await apiClient.post("/auth/login", loginData);

      const { accessToken, refreshToken } = response.data;
      setTokens(accessToken, refreshToken);

      return response.data;
    } catch (error) {
      console.error("로그인 실패:", error);
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
      await apiClient.post("/auth/oauth/logout");

      return { success: true };
    } catch (error) {
      console.error("로그아웃 실패:", error);
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
      setTokens(accessToken, newRefreshToken);

      return response.data;
    } catch (error) {
      console.error("토큰 재발급 실패:", error);
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

      const { getCurrentUser } = await import("@/lib/utils/tokenStorage");
      return getCurrentUser();
    } catch (error) {
      console.error("사용자 정보 조회 실패:", error);
      throw error;
    }
  },

  /**
   * 현재 사용자 정보 조회
   */
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get("/members/me");
      console.log("백엔드에서 사용자 정보 조회:", response.data);
      return response.data;
    } catch (error) {
      console.error("사용자 정보 조회 실패:", error);
      throw error;
    }
  },
};

export default authApi;
