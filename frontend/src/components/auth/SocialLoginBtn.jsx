import { useNavigate } from "react-router-dom";

export default function SocialLoginButtons({ demo = true }) {
  const navigate = useNavigate();

  // 데모: 실제 OAuth로 안 보내고 콜백으로 가짜 코드 전달
  const demoGo = (provider) =>
    navigate(`/oauth/callback?provider=${provider}&code=demo-code&state=demo`);

  // 실연동(나중에): 여기에 진짜 redirect 로직 넣기
  const realGo = (url) => (params) =>
    (window.location.href = `${url}?${new URLSearchParams(params).toString()}`);

  const onKakao = () =>
    demo ? demoGo("kakao") : /* realGo(KAKAO_AUTH)({ ... }) */ null;
  const onNaver = () =>
    demo ? demoGo("naver") : /* realGo(NAVER_AUTH)({ ... }) */ null;
  const onGoogle = () =>
    demo ? demoGo("google") : /* realGo(GOOGLE_AUTH)({ ... }) */ null;

  return (
    <div className="space-y-3">
      {/* 카카오 로그인 */}
      <button
        onClick={onKakao}
        className="w-full h-12 rounded flex items-center justify-center gap-2 bg-[#FEE500] hover:bg-[#F5DC00] transition-colors cursor-pointer font-medium"
      >
        <span className="text-base">카카오로 시작하기</span>
      </button>
      {/* 네이버 로그인 */}
      <button
        onClick={onNaver}
        className="w-full h-12 rounded flex items-center justify-center gap-2 bg-[#03C75A] hover:bg-[#02B350] text-white transition-colors cursor-pointer font-medium"
      >
        <span className="text-base">네이버로 시작하기</span>
      </button>
      {/* 구글 로그인 */}
      <button
        onClick={onGoogle}
        className="w-full h-12 rounded flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-100 transition-colors cursor-pointer font-medium"
      >
        <span className="text-base">구글로 시작하기</span>
      </button>
      <div className="relative flex items-center justify-center py-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative bg-white px-4 text-sm text-gray-600">
          비즈니스 로그인/회원가입
        </div>
      </div>
      {/* 비즈니스 회원 버튼
      <Link
        to="/signup/business"
        className="block w-full py-3 text-center border border-gray-400 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
      >
        비즈니스 로그인/회원가입
      </Link> */}
    </div>
  );
}
