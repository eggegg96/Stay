import { useState } from "react";

export default function PhoneVerificationStep({ onNext }) {
  const [phone, setPhone] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");

  const formatPhoneNumber = (value) => {
    const numbers = value.replace(/[^0-9]/g, ""); // 숫자만 추출

    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 7) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    } else if (numbers.length <= 11) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(
        7,
        11
      )}`;
    }
    return phone; // 11자리 초과 시 기존 값 유지
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
    setError(""); // 에러 초기화
  };

  /**
   * 휴대폰 번호 유효성 검증
   *
   * 검증 규칙:
   * - 010, 011, 016, 017, 018, 019로 시작
   * - 총 11자리 (하이픈 제외)
   */
  const isValidPhone = (phoneNum) => {
    const numbers = phoneNum.replace(/[^0-9]/g, "");
    const phoneRegex = /^01[0-9]{8,9}$/;
    return phoneRegex.test(numbers);
  };

  // ==================== 인증번호 전송 ====================
  /**
   * 인증번호 전송 핸들러
   *
   * 실제로는:
   * 1. 백엔드 API 호출 (POST /api/auth/send-sms)
   * 2. SMS 전송 (Twilio, NCP SENS 등)
   *
   * 지금은 프론트만 구현:
   * - UI 상태 변경 (인증번호 입력란 표시)
   */
  const handleSendCode = async () => {
    // 유효성 검증
    if (!isValidPhone(phone)) {
      setError("올바른 휴대폰 번호 형식이 아닙니다.");
      return;
    }

    try {
      setIsVerifying(true);

      // TODO: 백엔드 API 호출
      // const response = await authApi.sendVerificationCode(phone);

      console.log("인증번호 전송:", phone);

      // 성공 처리
      setIsCodeSent(true);
      setError("");
    } catch (err) {
      console.error("인증번호 전송 실패:", err);
      setError("인증번호 전송에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsVerifying(false);
    }
  };

  // ==================== 인증번호 확인 ====================
  /**
   * 인증번호 확인 핸들러
   *
   * 실제로는:
   * 1. 백엔드 API 호출 (POST /api/auth/verify-sms)
   * 2. Redis에 저장된 인증번호와 비교
   * 3. 성공 시 다음 단계로 이동
   *
   * 왜 서버에서 검증하나?
   * - 프론트에서만 검증하면 보안 위험 (개발자 도구로 우회 가능)
   * - 서버에서 시간 제한도 함께 체크 (3분 초과 시 실패)
   */
  const handleVerifyCode = async () => {
    // 유효성 검증
    if (verificationCode.length !== 6) {
      setError("인증번호 6자리를 입력해주세요.");
      return;
    }

    try {
      setIsVerifying(true);

      // TODO: 백엔드 API 호출
      // const response = await authApi.verifyCode(phone, verificationCode);

      console.log("인증 확인:", { phone, verificationCode });

      // 성공 처리
      setError("");

      // 다음 단계로 이동
      onNext();
    } catch (err) {
      console.error("인증 확인 실패:", err);
      setError("인증번호가 일치하지 않습니다. 다시 확인해주세요.");
    } finally {
      setIsVerifying(false);
    }
  };

  /**
   * 인증번호 재전송
   */
  const handleResendCode = () => {
    setVerificationCode("");
    handleSendCode();
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
      <div className="bg-white rounded-2xl shadow-sm space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            휴대폰 번호<span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={phone}
            onChange={handlePhoneChange}
            placeholder="010-1234-5678"
            disabled={isCodeSent}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isCodeSent ? "bg-gray-100 cursor-not-allowed" : "border-gray-300"
            }`}
          />
          {/* 에러 메시지 (인증번호 전송 전) */}
          {error && phone && !isCodeSent && (
            <p className="text-sm text-red-500 mt-2">{error}</p>
          )}

          {/* 인증번호 입력란 (전송 후에만 표시) */}
          {isCodeSent && (
            <div className="mt-6">
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => {
                  // 숫자만 입력, 최대 6자리
                  const value = e.target.value
                    .replace(/[^0-9]/g, "")
                    .slice(0, 6);
                  setVerificationCode(value);
                  setError(""); // 에러 초기화
                }}
                placeholder="인증번호 6자리 입력"
                maxLength={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* 재전송 링크 */}
              <div className="flex items-center justify-between mt-2 mb-4">
                <p className="text-sm text-gray-500">
                  인증번호가 오지 않나요?{" "}
                  <button
                    type="button"
                    onClick={handleResendCode}
                    className="text-blue-500 hover:underline font-medium"
                  >
                    재전송
                  </button>
                </p>
              </div>

              {/* 에러 메시지 (인증번호 확인 실패 시) */}
              {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
            </div>
          )}

          {/* 동적 버튼: 인증번호 전송 → 확인 */}
          <div className="mt-6">
            <button
              onClick={isCodeSent ? handleVerifyCode : handleSendCode}
              disabled={
                isCodeSent
                  ? verificationCode.length !== 6 || isVerifying // 인증번호 6자리 입력해야 활성화
                  : !phone || isVerifying // 휴대폰 번호 입력해야 활성화
              }
              className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                (isCodeSent ? verificationCode.length === 6 : phone) &&
                !isVerifying
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {isVerifying
                ? isCodeSent
                  ? "확인 중..."
                  : "전송 중..."
                : isCodeSent
                ? "확인"
                : "인증번호 전송"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
