import authApi from "@/lib/api/authApi";

/**
 * OAuth 핸들러 (백엔드 처리 방식)
 *
 * 장점:
 * - Client Secret 노출 안 됨
 * - 보안 강화
 * - 프론트엔드 코드 간소화
 */

/**
 * OAuth 로그인 처리 (통합 함수)
 *
 * @param {string} provider - 소셜 제공자 (google, naver, kakao)
 * @param {string} code - OAuth authorization code
 * @returns {Promise<Object>} 로그인 결과 (JWT 토큰)
 */
export const handleOAuthLogin = async (provider, code) => {
  try {
    console.log(`${provider.toUpperCase()} OAuth 로그인 처리 시작`);
    console.log("Code:", code);

    // 백엔드로 code 전달
    // POST /api/auth/oauth/login
    // { provider: "GOOGLE", code: "4/0AY0e..." }
    const result = await authApi.oauthLogin({
      provider: provider.toUpperCase(),
      code: code,
    });

    console.log("OAuth 로그인 성공:", result);
    return result;
  } catch (error) {
    console.error(`${provider.toUpperCase()} OAuth 로그인 실패:`, error);
    throw error;
  }
};

/**
 * 구글 OAuth 처리 (간소화)
 */
export const handleGoogleAuth = async (code) => {
  return handleOAuthLogin("google", code);
};

/**
 * 네이버 OAuth 처리 (간소화)
 */
export const handleNaverAuth = async (code) => {
  return handleOAuthLogin("naver", code);
};

/**
 * 카카오 OAuth 처리 (간소화)
 */
export const handleKakaoAuth = async (code) => {
  return handleOAuthLogin("kakao", code);
};
