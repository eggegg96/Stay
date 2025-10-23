import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function BusinessLogin() {
  const navigate = useNavigate();

  // 폼 데이터 상태 관리
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(""); // 입력 시 에러 메시지 초기화
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // 클라이언트 유효성 검증
    if (!formData.email.trim()) {
      setError("이메일을 입력해주세요.");
      return;
    }

    // 이메일 형식 간단 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("올바른 이메일 형식이 아닙니다.");
      return;
    }

    if (!formData.password.trim()) {
      setError("비밀번호를 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // TODO: 백엔드 API 연동
      // POST /api/business/auth/login
      // { email: "user@example.com", password: "password123" }
      // 응답: { accessToken, refreshToken, memberInfo }

      console.log("비즈니스 로그인 시도:", {
        email: formData.email,
      });

      // 임시: 개발 중이므로 알림 표시
      alert("비즈니스 로그인 기능은 백엔드 구현 후 활성화됩니다.");

      // 로그인 성공 시 처리 예시:
      // const result = await authApi.businessLogin(formData);
      // await login(result.memberInfo); // AuthContext에 저장
      // navigate("/business/dashboard"); // 비즈니스 대시보드로 이동
    } catch (err) {
      console.error("비즈니스 로그인 실패:", err);

      // 에러 메시지를 사용자 친화적으로 변환
      if (err.message?.includes("401") || err.message?.includes("인증")) {
        setError("이메일 또는 비밀번호가 올바르지 않습니다.");
      } else if (err.message?.includes("404")) {
        setError("등록되지 않은 이메일입니다.");
      } else {
        setError(err.message || "로그인에 실패했습니다. 다시 시도해주세요.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            비즈니스 회원 로그인
          </h1>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이메일
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="이메일을 입력하세요"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              비밀번호
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="비밀번호를 입력하세요"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? "로그인 중..." : "로그인"}
          </button>
        </form>
        <div className="mt-10 space-y-4 flex flex-col items-center">
          <p className="font-semibold text-sm text-gray-600">
            계정이 없으신가요?
          </p>
          <Link
            to="/business/signup?step=1"
            className="block w-full py-3 text-center border border-blue-500 text-blue-500 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            비즈니스 회원가입
          </Link>
        </div>
      </div>
    </section>
  );
}
