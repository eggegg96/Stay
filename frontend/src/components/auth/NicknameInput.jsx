import { useState, useEffect } from "react";
import authApi from "@/lib/api/authApi";

/**
 * 닉네임 입력 컴포넌트
 *
 * 기능:
 * - 닉네임 입력
 * - 실시간 유효성 검사 (클라이언트)
 * - 실시간 중복 체크 (서버)
 * - 피드백 메시지 표시
 *
 * 왜 필요한가?
 * - 소셜 로그인 후 닉네임 설정 단계에서 사용
 * - 사용자 친화적인 입력 경험 제공
 * - 중복 닉네임 미리 방지
 */
export default function NicknameInput({
  value,
  onChange,
  onValidationChange,
  className = "",
}) {
  const [nickname, setNickname] = useState(value || "");
  const [isChecking, setIsChecking] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success", "error", "info"

  /**
   * 클라이언트 유효성 검사
   *
   * 검증 규칙:
   * - 2-30자
   * - 한글, 영문, 숫자, 언더스코어만 허용
   * - 공백 불가
   */
  const validateNickname = (value) => {
    if (!value || value.trim() === "") {
      return { valid: false, message: "닉네임을 입력해주세요." };
    }

    if (value.length < 3) {
      return { valid: false, message: "닉네임은 최소 3자 이상이어야 합니다." };
    }

    if (value.length > 8) {
      return { valid: false, message: "닉네임은 최대 8자까지 가능합니다." };
    }

    // 한글, 영문, 숫자, 언더스코어만 허용
    const regex = /^[가-힣a-zA-Z0-9_]+$/;
    if (!regex.test(value)) {
      return {
        valid: false,
        message: "닉네임은 한글, 영문, 숫자, 언더스코어(_)만 사용 가능합니다.",
      };
    }

    return { valid: true, message: "" };
  };

  /**
   * 닉네임 중복 체크 (디바운싱)
   *
   * 왜 디바운싱?
   * - 사용자가 타이핑할 때마다 API 호출하면 서버 부하 증가
   * - 0.5초 대기 후 마지막 입력값만 체크
   */
  useEffect(() => {
    // 빈 값이면 체크 안 함
    if (!nickname || nickname.trim() === "") {
      setMessage("");
      setMessageType("");
      setIsValid(false);
      onValidationChange?.(false);
      return;
    }

    // 클라이언트 유효성 검사 먼저
    const clientValidation = validateNickname(nickname);
    if (!clientValidation.valid) {
      setMessage(clientValidation.message);
      setMessageType("error");
      setIsValid(false);
      onValidationChange?.(false);
      return;
    }

    // 디바운싱: 0.5초 대기
    const timer = setTimeout(async () => {
      setIsChecking(true);
      setMessage("중복 확인 중...");
      setMessageType("info");

      try {
        const result = await authApi.checkNickname(nickname);

        if (result.available) {
          setMessage(result.message || "사용 가능한 닉네임입니다.");
          setMessageType("success");
          setIsValid(true);
          onValidationChange?.(true);
        } else {
          setMessage(result.message || "이미 사용 중인 닉네임입니다.");
          setMessageType("error");
          setIsValid(false);
          onValidationChange?.(false);
        }
      } catch (error) {
        setMessage(error.message || "중복 확인에 실패했습니다.");
        setMessageType("error");
        setIsValid(false);
        onValidationChange?.(false);
      } finally {
        setIsChecking(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [nickname]);

  /**
   * 입력값 변경 핸들러
   */
  const handleChange = (e) => {
    const value = e.target.value;
    setNickname(value);
    onChange?.(value);
  };

  /**
   * 메시지 색상 스타일
   */
  const getMessageColor = () => {
    switch (messageType) {
      case "success":
        return "text-green-600";
      case "error":
        return "text-red-600";
      case "info":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  /**
   * 입력 필드 테두리 색상
   */
  const getBorderColor = () => {
    if (!nickname) return "border-gray-300";
    if (isChecking) return "border-blue-400";
    if (messageType === "success") return "border-green-500";
    if (messageType === "error") return "border-red-500";
    return "border-gray-300";
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* 입력 필드 */}
      <div className="relative">
        <input
          type="text"
          value={nickname}
          onChange={handleChange}
          placeholder="3-8자, 한글/영문/숫자/언더스코어"
          maxLength={8}
          className={`
            px-4 py-3 w-full border-2 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-blue-500/20
            transition-colors duration-200
            ${getBorderColor()}
          `}
        />

        {/* 로딩 스피너 */}
        {isChecking && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* 체크 아이콘 */}
        {!isChecking && isValid && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <svg
              className="w-6 h-6 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        )}
        {/* 에러 아이콘 */}
        {!isChecking && messageType === "error" && nickname && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <svg
              className="w-6 h-6 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        )}
      </div>
      {message && <p className={`text-sm ${getMessageColor()}`}>{message}</p>}
      <p className="text-xs text-gray-500 text-right">{nickname.length} / 8</p>
    </div>
  );
}
