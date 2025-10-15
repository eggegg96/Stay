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
  // ==================== 닉네임 관련 API ====================

  /**
   * 닉네임 중복 체크
   * - 사용자가 닉네임 입력할 때 실시간으로 중복 확인
   * - "이미 사용 중인 닉네임입니다" 같은 피드백 제공
   *
   * @param {string} nickname - 확인할 닉네임
   * @returns {Promise<{available: boolean, message: string}>}
   */
  checkNickname: async (nickname) => {
    try {
      const response = await apiClient.get("/members/check-nickname", {
        params: { nickname },
      });
      return response.data;
    } catch (error) {
      console.error("닉네임 중복 체크 실패:", error);
      throw new Error(
        error.response?.data?.message || "닉네임 중복 체크에 실패했습니다."
      );
    }
  },

  /**
   * 닉네임 설정/변경
   *
   * @param {number} memberId - 회원 ID
   * @param {string} nickname - 설정할 닉네임
   * @returns {Promise<Object>} 업데이트된 회원 정보
   *
   * 사용 예시:
   * const updatedUser = await authApi.updateNickname(1, "새로운닉네임");
   */
  updateNickname: async (memberId, nickname) => {
    try {
      const response = await apiClient.patch(`/members/${memberId}/nickname`, {
        nickname,
      });
      return response.data;
    } catch (error) {
      console.error("닉네임 설정 실패:", error);

      const errorMessage = error.response?.data?.message;
      if (errorMessage?.includes("중복")) {
        throw new Error("이미 사용 중인 닉네임입니다.");
      } else if (errorMessage?.includes("형식")) {
        throw new Error("닉네임 형식이 올바르지 않습니다.");
      } else if (errorMessage?.includes("길이")) {
        throw new Error("닉네임은 2-30자 사이여야 합니다.");
      }

      throw new Error(errorMessage || "닉네임 설정에 실패했습니다.");
    }
  },

  /**
   * 회원 ID로 회원 정보 조회
   * @param {number} memberId - 회원 ID
   * @returns {Promise<Object>} 회원 정보
   */
  getMember: async (memberId) => {
    try {
      const response = await apiClient.get(`/members/${memberId}`);
      return response.data;
    } catch (error) {
      console.error("회원 정보 조회 실패:", error);
      throw new Error(
        error.response?.data?.message || "회원 정보 조회에 실패했습니다."
      );
    }
  },
};
export default authApi;
