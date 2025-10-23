import { useState } from "react";

export default function BusinessEmailVerificationStep({ initialData, onNext }) {
  const [email, setEmail] = useState(initialData?.email || "");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = () => {
    if (!email.trim()) {
      setError("이메일을 입력해주세요.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("올바른 이메일 형식이 아닙니다.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 유효성 검증
    if (!validateEmail()) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // TODO: 백엔드 API 연동
      // POST /api/business/auth/send-verification-email
      // { email: "user@company.com" }
      // 응답: { success: true, message: "인증 메일이 발송되었습니다." }

      console.log("인증 메일 발송 요청:", email);

      // 임시: 1초 대기 (실제 API 호출 시뮬레이션)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      onNext({ email });
    } catch (err) {
      console.error("인증 메일 발송 실패:", err);

      if (err.message?.includes("이미 가입")) {
        setError("이미 가입된 이메일입니다.");
      } else if (err.message?.includes("형식")) {
        setError("올바른 이메일 형식이 아닙니다.");
      } else {
        setError(
          err.message || "인증 메일 발송에 실패했습니다. 다시 시도해주세요."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-3">이메일 확인</h1>
        <p className="text-gray-600">소속 이메일을 인증해 주세요.</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            이메일
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(""); // 입력 시 에러 초기화
            }}
            placeholder="회사 이메일을 입력해주세요."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoComplete="email"
            disabled={isLoading}
          />
          <p className="mt-2 text-xs text-gray-500">예: name@company.com</p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? "전송 중..." : "인증메일 전송"}
        </button>
      </form>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>💡 안내:</strong> 입력하신 이메일로 인증 링크가 발송됩니다.
          메일을 확인하여 인증을 완료해주세요.
        </p>
      </div>
    </div>
  );
}
