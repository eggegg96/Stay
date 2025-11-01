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

  /**
   * OAuth 최종 회원가입 (닉네임 포함)
   *
   * POST /api/auth/oauth/register
   *
   * 왜 필요한가?
   * - OAuth 인증 후 닉네임까지 입력받아서 한 번에 회원가입 완료
   * - 251102 문제인 소셜 회원가입시 생기는 DB에 null값인 닉네임을 저장하려는 문제를 해결함
   * - nickname=NULL 레코드 생기지 않음
   *
   * @param {Object} data - OAuth 정보 + 닉네임
   * @param {string} data.provider - 소셜 제공자 (GOOGLE, NAVER, KAKAO)
   * @param {string} data.providerId - 소셜 고유 ID
   * @param {string} data.email - 이메일
   * @param {string} data.name - 이름
   * @param {string} data.nickname - 닉네임
   * @param {string} [data.profileImageUrl] - 프로필 이미지 (선택)
   * @returns {Promise<Object>} 회원가입 성공 응답
   */
  registerWithOAuth: async (data) => {
    try {
      console.log("========================================");
      console.log("OAuth 최종 회원가입 API 호출");
      console.log("Provider:", data.provider);
      console.log("Email:", data.email);
      console.log("Nickname:", data.nickname);
      console.log("========================================");

      // 백엔드 형식에 맞게 데이터 변환
      const requestData = {
        provider: data.provider,
        socialId: data.providerId, // ← providerId → socialId
        email: data.email,
        name: data.name,
        socialEmail: data.email, // ← socialEmail 추가
        profileImageUrl: data.profileImageUrl || null,
        nickname: data.nickname,
      };

      console.log("변환된 요청 데이터:", requestData);

      const response = await apiClient.post(
        "/auth/oauth/register",
        requestData
      );

      console.log("OAuth 최종 회원가입 API 응답:", response.data);

      if (!response.data.success) {
        throw new Error(response.data.message || "회원가입에 실패했습니다");
      }

      return response.data;
    } catch (error) {
      console.error("OAuth 최종 회원가입 API 실패:", error);

      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }

      throw new Error("회원가입 처리 중 오류가 발생했습니다");
    }
  },
};
export default authApi;
