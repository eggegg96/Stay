import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@contexts/AuthContext";
import authApi from "@/lib/api/authApi";
import NicknameInput from "@/components/auth/NicknameInput";

export default function UserInfoStep({ onNext }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  // sessionStorage에서 OAuth 정보 가져오기
  const fromOAuth = location.state?.fromOAuth;
  const [oauthData, setOauthData] = useState(null);

  useEffect(() => {
    if (fromOAuth) {
      const storedData = sessionStorage.getItem("oauthData");
      if (storedData) {
        const parsed = JSON.parse(storedData);
        console.log("========================================");
        console.log("UserInfoStep - OAuth 정보 로드 완료");
        console.log("Provider:", parsed.provider);
        console.log("Email:", parsed.email);
        console.log("========================================");
        setOauthData(parsed);
      } else {
        console.error("OAuth 정보를 찾을 수 없습니다!");
        navigate("/login", { replace: true });
      }
    }
  }, [fromOAuth, navigate]);

  const [formData, setFormData] = useState({
    year: "",
    month: "",
    day: "",
    gender: "",
    nickname: "",
  });

  // 에러 및 로딩 상태
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isNicknameValid, setIsNicknameValid] = useState(false);

  const years = Array.from({ length: 100 }, (_, i) => 2025 - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(""); // 입력 시 에러 메시지 초기화
  };

  // 만 14세 이상 확인
  const isOver14 = () => {
    if (!formData.year || !formData.month || !formData.day) return true;

    const today = new Date();
    const birthDate = new Date(formData.year, formData.month - 1, formData.day);

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age >= 14;
  };

  /**
   * 폼 유효성 검증
   *
   * 모든 필수 필드가 채워져 있고, 닉네임이 유효하며, 만 14세 이상이어야 함
   */
  const canProceed =
    formData.year &&
    formData.month &&
    formData.day &&
    formData.gender &&
    formData.nickname &&
    formData.nickname.length >= 3 &&
    isNicknameValid && // 닉네임 유효성 체크 추가
    isOver14();

  /**
   * 회원가입 완료 처리
   *
   * OAuth로 온 경우: location.state에서 이메일 가져오기
   * 일반 회원가입: user.id 사용
   */
  const handleSubmit = async () => {
    if (!canProceed) return;

    // 14세 미만 재확인
    if (!isOver14()) {
      setError("만 14세 이상만 가입할 수 있습니다.");
      return;
    }

    // OAuth 정보 확인
    if (!oauthData) {
      setError("OAuth 정보를 찾을 수 없습니다. 다시 로그인해주세요.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      console.log("========================================");
      console.log("OAuth 최종 회원가입 시도");
      console.log("Provider:", oauthData.provider);
      console.log("Email:", oauthData.email);
      console.log("Nickname:", formData.nickname);
      console.log("========================================");

      // 최종 가입 API 호출
      await authApi.registerWithOAuth({
        provider: oauthData.provider,
        providerId: oauthData.providerId,
        email: oauthData.email,
        name: oauthData.name,
        nickname: formData.nickname,
        profileImageUrl: oauthData.profileImageUrl || null,
      });

      console.log("OAuth 최종 회원가입 성공");

      // sessionStorage에서 OAuth 정보 삭제
      sessionStorage.removeItem("oauthData");

      console.log("사용자 정보 조회 시작...");
      try {
        const userData = await authApi.getCurrentUser();
        console.log("사용자 정보 조회 성공:", userData);

        // AuthContext에 저장
        await login(userData); // ← userData를 전달!
      } catch (err) {
        console.error("사용자 정보 조회 실패:", err);
        // 최소한의 정보로라도 로그인 처리
        await login({ email: oauthData.email, nickname: formData.nickname });
      }

      console.log("로그인 상태 업데이트 완료");
      console.log("회원가입 완료 - 4단계로 이동");

      // 성공 시 다음 단계로
      onNext();
    } catch (err) {
      console.error("========================================");
      console.error("OAuth 최종 회원가입 실패:", err);
      console.error("========================================");

      // 에러 메시지 처리
      if (err.message?.includes("닉네임")) {
        setError("닉네임 설정에 실패했습니다. 다시 시도해주세요.");
      } else if (err.message?.includes("이미 가입")) {
        setError("이미 가입된 계정입니다. 로그인해주세요.");
      } else {
        setError(err.message || "회원가입에 실패했습니다. 다시 시도해주세요.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12">
      {/* 헤더 */}
      <div className="py-3">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          필수 정보 입력
        </h1>
        <p className="text-slate-500">가입을 위해 필수 정보를 입력해 주세요.</p>
        {/* OAuth 이메일 표시 */}
        {oauthData && (
          <p className="text-sm text-blue-600 mt-2">📧 {oauthData.email}</p>
        )}
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* 정보 입력 폼 */}
      <div className="space-y-4">
        {/* 생년월일 */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-2">
            생년월일<span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {/* 년 */}
            <select
              value={formData.year}
              onChange={(e) => handleChange("year", e.target.value)}
              className="px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">년도</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            {/* 월 */}
            <select
              value={formData.month}
              onChange={(e) => handleChange("month", e.target.value)}
              className="px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">월</option>
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>

            {/* 일 */}
            <select
              value={formData.day}
              onChange={(e) => handleChange("day", e.target.value)}
              className="px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">일</option>
              {days.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>
          {formData.year && formData.month && formData.day && !isOver14() && (
            <p className="text-sm text-red-500 mt-2">
              만 14세 이상만 가입 가능합니다
            </p>
          )}
        </div>

        {/* 성별 */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-2">
            성별<span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-4 py-2">
            {/* 여자 */}
            <label className="flex items-center justify-center px-4 cursor-pointer">
              <input
                type="radio"
                name="gender"
                value="female"
                checked={formData.gender === "female"}
                onChange={(e) => handleChange("gender", e.target.value)}
                className="mr-3"
              />
              여자
            </label>

            {/* 남자 */}
            <label className="flex items-center justify-center px-4 cursor-pointer">
              <input
                type="radio"
                name="gender"
                value="male"
                checked={formData.gender === "male"}
                onChange={(e) => handleChange("gender", e.target.value)}
                className="mr-3"
              />
              남자
            </label>
          </div>
        </div>

        {/* 닉네임 - NicknameInput 컴포넌트 사용 */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-2">
            닉네임<span className="text-red-500">*</span>
          </label>
          <NicknameInput
            value={formData.nickname}
            onChange={(value) => handleChange("nickname", value)}
            onValidationChange={setIsNicknameValid}
          />
        </div>
      </div>

      {/* 완료 버튼 */}
      <button
        onClick={handleSubmit}
        disabled={!canProceed || isSubmitting}
        className={`w-full mt-6 py-4 rounded-lg font-semibold transition-colors ${
          canProceed && !isSubmitting
            ? "bg-blue-500 text-white hover:bg-blue-600"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        {isSubmitting ? "처리 중..." : "확인"}
      </button>
    </div>
  );
}
