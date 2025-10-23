import { useState } from "react";

export default function BusinessEmailSentStep({ email, onResend, onNext }) {
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleResend = async () => {
    setIsResending(true);
    setError("");
    setResendSuccess(false);

    try {
      // TODO: 백엔드 API 연동
      // POST /api/business/auth/resend-verification-email
      // { email: "user@company.com" }

      console.log("인증 메일 재발송:", email);

      // 임시: 1초 대기
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (onResend) {
        await onResend();
      }

      setResendSuccess(true);

      // 3초 후 성공 메시지 초기화
      setTimeout(() => {
        setResendSuccess(false);
      }, 3000);
    } catch (err) {
      console.error("인증 메일 재발송 실패:", err);
      setError(
        err.message || "메일 재발송에 실패했습니다. 잠시 후 다시 시도해주세요."
      );
    } finally {
      setIsResending(false);
    }
  };

  /**
   * 개발용: 이메일 인증 건너뛰기
   * 실제 배포 시에는 제거해야 함
   */
  const handleSkipForDev = () => {
    console.log("개발용: 이메일 인증 건너뛰기");
    onNext();
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
          <svg
            className="w-10 h-10 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          인증 메일이 발송 되었습니다.
        </h1>
        <div className="space-y-2">
          <p className="text-blue-600 font-medium">{email}</p>
          <p className="text-gray-600">인증 메일 전송이 완료 되었습니다.</p>
        </div>
      </div>

      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-700 mb-2">
          메일을 확인 후 메일에 있는{" "}
          <strong className="text-blue-600">"메일 인증하기"</strong> 버튼을
          클릭해 주세요.
        </p>
        <p className="text-xs text-gray-500">
          혹시 메일을 받지 못하셨다면 아래 재 전송 버튼을 클릭해 주세요.
        </p>
      </div>

      {resendSuccess && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-600">
            ✓ 인증 메일이 재발송되었습니다.
          </p>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <button
        onClick={handleResend}
        disabled={isResending}
        className="w-full py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isResending ? "재전송 중..." : "인증메일 재전송"}
      </button>

      {/* 개발용: 건너뛰기 버튼 (실제 배포 시 제거) */}
      {import.meta.env.DEV && (
        <button
          onClick={handleSkipForDev}
          className="w-full mt-3 py-2 text-sm text-gray-500 hover:text-gray-700 underline"
        >
          [개발용] 이메일 인증 건너뛰기
        </button>
      )}

      <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
        <p className="text-xs text-yellow-800">
          <strong>📧 메일이 안 보이나요?</strong>
          <br />
          스팸함이나 프로모션 탭을 확인해주세요. 일부 메일 서비스에서는 인증
          메일이 해당 폴더로 분류될 수 있습니다.
        </p>
      </div>
    </div>
  );
}
