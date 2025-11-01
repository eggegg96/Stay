import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { handleOAuthLogin } from "@/lib/oauth/oauthHandler";
import { useAuth } from "@/contexts/AuthContext";
import { UI_DELAY } from "@/constants/common";
import authApi from "@/lib/api/authApi";

export default function OAuthCallback() {
  const { login } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(true);
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) {
      console.log("OAuth 이미 처리됨 - 무시");
      return;
    }

    const processOAuth = async () => {
      hasProcessed.current = true;

      try {
        const code = searchParams.get("code");
        const state = searchParams.get("state");
        const errorParam = searchParams.get("error");

        console.log("========================================");
        console.log("OAuth 콜백 시작");
        console.log("state (provider):", state);
        console.log("code:", code?.substring(0, 20) + "...");
        console.log("========================================");

        if (errorParam) {
          throw new Error(`OAuth 인증 실패: ${errorParam}`);
        }

        if (!state || !code) {
          throw new Error("필수 파라미터가 누락되었습니다.");
        }

        const provider = state;

        // 백엔드로 OAuth 로그인 처리
        console.log("백엔드 OAuth API 호출 중...");
        const result = await handleOAuthLogin(provider, code);

        console.log("========================================");
        console.log("백엔드 응답:");
        console.log("result:", result);
        console.log("isNewMember:", result.isNewMember);
        console.log("email:", result.email);
        console.log("========================================");

        // 신규 회원인 경우 회원가입 페이지로 이동
        if (result.isNewMember === true) {
          console.log("신규 회원 감지 - OAuth 정보를 sessionStorage에 저장");

          // sessionStorage에 OAuth 정보 저장
          sessionStorage.setItem("oauthData", JSON.stringify(result.oauthData));

          console.log("OAuth Data 저장 완료:", result.oauthData);

          setTimeout(() => {
            navigate("/signup", {
              replace: true,
              state: {
                fromOAuth: true,
                isNewMember: true,
              },
            });
          }, UI_DELAY.REDIRECT);
          return;
        }

        // 기존 회원인 경우 로그인 상태 업데이트
        console.log("기존 회원 - 로그인 처리");
        // 사용자 정보 조회 (nickname, grade 포함)
        try {
          const userData = await authApi.getCurrentUser();
          console.log("사용자 정보 조회 성공:", userData);

          // AuthContext에 저장
          await login(userData);
        } catch (err) {
          console.error("사용자 정보 조회 실패:", err);
          // 최소한의 정보로라도 로그인 처리
          await login({ email: result.email });
        }

        console.log("로그인 상태 업데이트 완료 - 홈으로 이동");

        // 홈으로 이동
        navigate("/", { replace: true });
      } catch (err) {
        console.error("OAuth 처리 실패:", err);
        setError(err.message);

        setTimeout(() => {
          navigate("/login", { replace: true });
        }, UI_DELAY);
      } finally {
        setIsProcessing(false);
      }
    };

    processOAuth();
  }, []); // 의존성 배열 비움 (최초 1회만 실행)

  return (
    <section className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6">
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
            <p className="text-gray-700 text-lg">처리 완료!</p>
            <p className="text-gray-400 text-sm mt-2">페이지 이동 중...</p>
          </>
        )}
      </div>
    </section>
  );
}
