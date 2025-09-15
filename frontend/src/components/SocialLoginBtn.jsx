// src/components/SocialLoginButtons.jsx
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
      <button
        onClick={onKakao}
        className="w-full h-12 rounded bg-yellow-300 cursor-pointer"
      >
        카카오로 시작하기
      </button>
      <button
        onClick={onNaver}
        className="w-full h-12 rounded bg-green-500 text-white cursor-pointer"
      >
        네이버로 시작하기
      </button>
      <button
        onClick={onGoogle}
        className="w-full h-12 rounded border cursor-pointer"
      >
        구글로 시작하기
      </button>
    </div>
  );
}
