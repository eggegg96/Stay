import { Link } from "react-router-dom";
import SocialLoginButtons from "@/components/auth/SocialLoginBtn";

export default function Login() {
  return (
    <section className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-4">
        <div className="text-5xl font-bold text-center">Stay</div>
        <div className="relative flex items-center justify-center py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative bg-white px-4 text-sm text-gray-600">
            로그인/회원가입
          </div>
        </div>
        <SocialLoginButtons demo={false} />
        <div className="flex center justify-center">
          <a>
            <Link
              to="/business/Login"
              className="inline-flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors cursor-pointer font-semibold text-slate-700 rounded-md px-2 py-1"
            >
              비즈니스 회원으로 시작하기
            </Link>
          </a>
        </div>
      </div>
    </section>
  );
}
