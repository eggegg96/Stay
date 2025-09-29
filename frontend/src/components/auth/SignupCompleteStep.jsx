import { Link } from "react-router-dom";

export default function SignupCompleteStep() {
  return (
    <div className="max-w-md mx-auto text-center space-y-8">
      {/* 체크 아이콘 */}
      <div className="flex justify-center">
        <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center">
          <svg
            className="w-14 h-14 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      </div>

      {/* 완료 메시지 */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          회원가입이 완료되었어요!
        </h1>
        <p className="text-gray-600 text-lg">
          짝짝짝짝 x1000
          <br />
          여기어때로 오신 것을 격하게 환영합니다!
        </p>
      </div>

      {/* 홈으로 버튼 */}
      <Link
        to="/"
        className="inline-block w-full py-4 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
      >
        홈으로
      </Link>
    </div>
  );
}
