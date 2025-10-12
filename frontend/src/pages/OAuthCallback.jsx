import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { handleOAuthLogin } from "@/lib/oauth/oauthHandler";
import { useAuth } from "@/contexts/AuthContext";
import { UI_DELAY } from "@/constants/common";

export default function OAuthCallback() {
  const { login } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(true);
  const hasProcessed = useRef(false); // 중복 실행 방지

  useEffect(() => {
    // 이미 처리했으면 무시
    if (hasProcessed.current) {
      console.log("OAuth 이미 처리됨 - 무시");
      return;
    }

    const processOAuth = async () => {
      hasProcessed.current = true; // 처리 시작

      try {
        const code = searchParams.get("code");
        const state = searchParams.get("state");
        const errorParam = searchParams.get("error");

        console.log("OAuth 콜백 - state:", state, "code:", code);

        if (errorParam) {
          throw new Error(`OAuth 인증 실패: ${errorParam}`);
        }

        if (!state || !code) {
          throw new Error("필수 파라미터가 누락되었습니다.");
        }

        // 데모 모드는 그대로
        if (code === "demo-code-123" || code === "demo-code") {
          console.log("[DEMO] 데모 로그인 처리");
          setTimeout(() => {
            navigate("/", { replace: true });
          }, UI_DELAY.REDIRECT);
          return;
        }

        const provider = state;

        // 백엔드로 OAuth 로그인 처리
        const result = await handleOAuthLogin(provider, code);

        // 로그인 상태 업데이트
        await login({
          email: result.email || result.user?.email || "user@example.com",
          // 백엔드 응답에 따라 추가 정보 설정
        });

        console.log("로그인 상태 업데이트 완료");

        // 홈으로 이동
        navigate("/", { replace: true });
      } catch (err) {
        console.error("OAuth 처리 실패:", err);
        setError(err.message);

        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 3000);
      } finally {
        setIsProcessing(false);
      }
    };

    processOAuth();
  }, []);

  return (
    <section className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6">
      {/* 기존 UI 그대로 */}
      <div className="text-center">
        {isProcessing ? (
          <>
            <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-700 text-lg mt-4">로그인 처리 중...</p>
          </>
        ) : error ? (
          <>
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
