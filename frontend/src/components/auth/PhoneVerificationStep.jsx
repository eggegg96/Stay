import { useState } from "react";

export default function PhoneVerificationStep({ onNext }) {
  const [phone, setPhone] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);

  const handleSendCode = () => {
    // TODO: 실제 인증번호 전송 API
    console.log("인증번호 전송:", phone);
    setIsCodeSent(true);
  };

  const handleVerify = () => {
    // TODO: 실제 인증 확인 API
    console.log("인증 확인:", { phone, verificationCode });
    onNext();
  };

  return (
    <div className="max-w-md mx-auto">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">휴대폰 인증</h1>
        <p className="text-gray-600">
          원활한 서비스 제공을 위해, 휴대폰 번호를 입력해 주세요.
        </p>
      </div>

      {/* 인증 폼 */}
      <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
        {/* 휴대폰 번호 입력 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            휴대폰 번호<span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="01012345678"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* 인증번호 전송 버튼 */}
        {!isCodeSent && (
          <button
            onClick={handleSendCode}
            disabled={!phone}
            className={`w-full py-3 rounded-lg font-medium transition-colors ${
              phone
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            인증번호 전송
          </button>
        )}

        {/* 인증번호 입력 (전송 후) */}
        {isCodeSent && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                인증번호<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="인증번호 6자리 입력"
                maxLength={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-sm text-gray-500 mt-2">
                인증번호가 오지 않나요?{" "}
                <button
                  onClick={handleSendCode}
                  className="text-blue-500 underline"
                >
                  재전송
                </button>
              </p>
            </div>

            <button
              onClick={handleVerify}
              disabled={!verificationCode}
              className={`w-full py-3 rounded-lg font-medium transition-colors ${
                verificationCode
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              인증번호 전송
            </button>
          </>
        )}
      </div>
    </div>
  );
}
