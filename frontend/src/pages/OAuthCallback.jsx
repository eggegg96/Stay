import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { handleOAuthLogin } from "@/lib/oauth/oauthHandler";

/**
 * OAuth 콜백 페이지
 *
 * 역할:
 * 1. 소셜 제공자로부터 리다이렉트되어 돌아오는 페이지
 * 2. URL에서 code를 받아서 백엔드로 전달
 * 3. 로그인 성공 시 홈으로 이동
 *
 * URL 예시:
 * /oauth/callback?code=4/0AY0e...&state=google
 *
 * 변경 사항:
 * - provider는 state 파라미터에서 가져옴 (구글은 state를 그대로 반환)
 * - 프론트엔드는 code만 백엔드로 전달
 * - 백엔드가 OAuth 처리 (훨씬 간단해짐!)
 */
export default function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const processOAuth = async () => {
      try {
        // URL에서 파라미터 추출
        const code = searchParams.get("code");
        const state = searchParams.get("state"); // ⭐ state에서 provider 가져오기
        const errorParam = searchParams.get("error");

        console.log("OAuth 콜백 - state:", state, "code:", code);

        // 에러 체크
        if (errorParam) {
          throw new Error(`OAuth 인증 실패: ${errorParam}`);
        }

        // 필수 파라미터 체크
        if (!state || !code) {
          throw new Error("필수 파라미터가 누락되었습니다.");
        }

        // 데모 모드 체크
        if (code === "demo-code-123" || code === "demo-code") {
          console.log("[DEMO] 데모 로그인 처리");

          // 데모는 바로 홈으로 (토큰 없이)
          setTimeout(() => {
            navigate("/", { replace: true });
          }, 1500);
          return;
        }

        // provider는 state 값 (google, naver, kakao)
        const provider = state;

        // 백엔드로 code 전달
        // POST /api/auth/oauth/login
        // { provider: "GOOGLE", code: "4/0AY0e..." }
        const result = await handleOAuthLogin(provider, code);

        // 홈으로 이동
        navigate("/", { replace: true });
      } catch (err) {
        console.error("OAuth 처리 실패:", err);
        setError(err.message);

        // 3초 후 로그인 페이지로
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 3000);
      } finally {
        setIsProcessing(false);
      }
    };

    processOAuth();
  }, [searchParams, navigate]);

  return (
    <section className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6">
      <div className="text-center">
        {isProcessing ? (
          <>
            {/* 로딩 스피너 */}
            <div className="w-16 h-16 border-3 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          </>
        ) : error ? (
          <>
            {/* 에러 메시지 */}
            <div className="text-red-500 mb-4">
              <svg
                className="h-16 w-16 mx-auto mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-gray-700 text-lg mb-2">로그인 실패</p>
            <p className="text-gray-500 text-sm">{error}</p>
            <p className="text-gray-400 text-sm mt-2">
              잠시 후 로그인 페이지로 이동합니다...
            </p>
          </>
        ) : (
          <>
            {/* 성공 메시지 */}
            <div className="text-green-500 mb-4">
              <svg
                className="h-16 w-16 mx-auto mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="text-gray-700 text-lg">로그인 성공!</p>
            <p className="text-gray-400 text-sm mt-2">
              잠시 후 메인 페이지로 이동합니다...
            </p>
          </>
        )}
      </div>
    </section>
  );
}
