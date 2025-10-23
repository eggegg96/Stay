import { useNavigate } from "react-router-dom";
import {
  GOOGLE_AUTH_CONFIG,
  NAVER_AUTH_CONFIG,
  KAKAO_AUTH_CONFIG,
  buildAuthUrl,
} from "@/lib/oauth/oauthConfig";

/**
 * 소셜 로그인 버튼 컴포넌트
 *
 * @param {boolean} demo - 데모 모드 여부 (true: 가짜 OAuth, false: 실제 OAuth)
 *
 * 왜 demo 모드가 필요한가?
 * - 개발 초기에는 실제 OAuth 설정 없이도 테스트 가능
 * - OAuth 클라이언트 ID를 발급받기 전에도 개발 진행 가능
 * - demo=false로 설정하면 실제 소셜 로그인 사용
 */
export default function SocialLoginButtons({ demo = false }) {
  const navigate = useNavigate();

  /**
   * 데모 모드: 가짜 OAuth callback으로 이동
   * 실제 소셜 제공자로 가지 않고 바로 callback 페이지로
   */
  const demoLogin = (provider) => {
    console.log(`[DEMO] ${provider} 로그인 시뮬레이션`);
    navigate(
      `/oauth/callback?provider=${provider}&code=demo-code-123&state=demo`
    );
  };

  /**
   * 실제 OAuth: 소셜 제공자의 로그인 페이지로 리다이렉트
   */
  const realLogin = (config) => {
    const authUrl = buildAuthUrl(config);
    console.log("OAuth URL로 리다이렉트:", authUrl);
    window.location.href = authUrl;
  };

  /**
   * 카카오 로그인 핸들러
   */
  const handleKakaoLogin = () => {
    if (demo) {
      demoLogin("kakao");
    } else {
      if (!import.meta.env.VITE_KAKAO_CLIENT_ID) {
        alert(
          "카카오 클라이언트 ID가 설정되지 않았습니다.\n.env 파일을 확인해주세요."
        );
        return;
      }
      realLogin(KAKAO_AUTH_CONFIG);
    }
  };

  /**
   * 네이버 로그인 핸들러
   */
  const handleNaverLogin = () => {
    if (demo) {
      demoLogin("naver");
    } else {
      if (!import.meta.env.VITE_NAVER_CLIENT_ID) {
        alert(
          "네이버 클라이언트 ID가 설정되지 않았습니다.\n.env 파일을 확인해주세요."
        );
        return;
      }
      realLogin(NAVER_AUTH_CONFIG);
    }
  };

  /**
   * 구글 로그인 핸들러
   */
  const handleGoogleLogin = () => {
    // 디버깅용 로그
    console.log(
      "VITE_GOOGLE_CLIENT_ID:",
      import.meta.env.VITE_GOOGLE_CLIENT_ID
    );

    if (demo) {
      demoLogin("google");
    } else {
      if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
        alert(
          "구글 클라이언트 ID가 설정되지 않았습니다.\n.env 파일을 확인해주세요."
        );
        return;
      }
      realLogin(GOOGLE_AUTH_CONFIG);
    }
  };

  return (
    <div className="space-y-3">
      {/* 카카오 로그인 */}
      <button
        onClick={handleKakaoLogin}
        className="w-full h-12 rounded flex items-center justify-center gap-2 bg-[#f5e23b] hover:bg-[#F5DC00] transition-colors cursor-pointer font-medium"
      >
        <span className="text-base text-gray-700 font-semibold">
          카카오로 시작하기
        </span>
      </button>

      {/* 네이버 로그인 */}
      <button
        onClick={handleNaverLogin}
        className="w-full h-12 rounded flex items-center justify-center gap-2 bg-[#03C75A] hover:bg-[#02B350] text-white transition-colors cursor-pointer font-medium"
      >
        <span className="text-base font-semibold">네이버로 시작하기</span>
      </button>

      {/* 구글 로그인 */}
      <button
        onClick={handleGoogleLogin}
        className="w-full h-12 rounded flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-100 transition-colors cursor-pointer font-medium"
      >
        <span className="text-base font-semibold text-slate-500">
          구글로 시작하기
        </span>
      </button>
    </div>
  );
}
