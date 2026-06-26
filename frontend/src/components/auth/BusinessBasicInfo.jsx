import { useState } from "react";
import NicknameInput from "./NicknameInput";
import BirthDatePicker from "@/components/auth/BirthDatePicker";
import authApi from "@/lib/api/authApi";

/**
 * Props:
 * @param {Object} initialData - 이전 단계에서 입력한 데이터 (소속, 이메일 등)
 * @param {Function} onNext - 다음 단계로 이동 (완료)
 */
export default function BusinessBasicInfo({ initialData, onNext }) {
  // ==================== State ====================
  const [formData, setFormData] = useState({
    password: "", // 비밀번호
    passwordConfirm: "", // 비밀번호 확인
    birthDate: "", // 생년월일 (YYYY-MM-DD)
    gender: "", // 성별 (male/female)
    name: initialData?.name || "", // 이름
    nickname: "", // 닉네임
  });

  const [errors, setErrors] = useState({});
  const [isNicknameValid, setIsNicknameValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  // ==================== 입력 핸들러 ====================
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // 해당 필드의 에러 초기화
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // ==================== 비밀번호 유효성 검증 ====================
  /**
   * 비밀번호 유효성 검증
   *
   * 검증 규칙:
   * - 8~20자
   * - 영문, 숫자 포함 필수
   * - 특수문자 선택 (보안 강화)
   *
   * 왜 이렇게?
   * - 너무 복잡하면 사용자가 불편함
   * - 기본적인 보안은 유지하되 실용성 고려
   */
  const isValidPassword = (pw) => {
    if (pw.length < 8 || pw.length > 20) return false;

    const hasLetter = /[a-zA-Z]/.test(pw);
    const hasNumber = /[0-9]/.test(pw);

    return hasLetter && hasNumber;
  };

  /**
   * 비밀번호 강도 표시
   */
  const getPasswordStrength = (pw) => {
    if (pw.length === 0) return { level: 0, text: "", color: "" };
    if (pw.length < 8) return { level: 1, text: "약함", color: "text-red-500" };

    const hasLetter = /[a-zA-Z]/.test(pw);
    const hasNumber = /[0-9]/.test(pw);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pw);
    const hasUpper = /[A-Z]/.test(pw);
    const hasLower = /[a-z]/.test(pw);

    let strength = 0;
    if (hasLetter) strength++;
    if (hasNumber) strength++;
    if (hasSpecial) strength++;
    if (hasUpper && hasLower) strength++;
    if (pw.length >= 12) strength++;

    if (strength <= 2) return { level: 1, text: "약함", color: "text-red-500" };
    if (strength === 3)
      return { level: 2, text: "보통", color: "text-yellow-500" };
    return { level: 3, text: "강함", color: "text-green-500" };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  // ==================== 전체 폼 유효성 검증 ====================
  const validateForm = () => {
    const newErrors = {};

    // 비밀번호
    if (!formData.password) {
      newErrors.password = "비밀번호를 입력해주세요.";
    } else if (!isValidPassword(formData.password)) {
      newErrors.password = "8~20자의 영문, 숫자를 포함해야 합니다.";
    }

    // 비밀번호 확인
    if (!formData.passwordConfirm) {
      newErrors.passwordConfirm = "비밀번호 확인을 입력해주세요.";
    } else if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = "비밀번호가 일치하지 않습니다.";
    }

    // 생년월일
    if (!formData.birthDate) {
      newErrors.birthDate = "생년월일을 선택해주세요.";
    }

    // 성별
    if (!formData.gender) {
      newErrors.gender = "성별을 선택해주세요.";
    }

    // 이름
    if (!formData.name) {
      newErrors.name = "이름을 입력해주세요.";
    } else if (formData.name.length < 2) {
      newErrors.name = "이름은 최소 2자 이상이어야 합니다.";
    }

    // 닉네임 (NicknameInput 컴포넌트에서 검증)
    if (!formData.nickname) {
      newErrors.nickname = "닉네임을 입력해주세요.";
    } else if (!isNicknameValid) {
      newErrors.nickname = "닉네임 중복 확인이 필요합니다.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ==================== 제출 핸들러 ====================
  /**
   * 회원가입 완료 처리
   *
   * 실제로는:
   * 1. 모든 단계의 데이터를 백엔드로 전송
   * 2. 사업자 회원 등록 API 호출
   * 3. 성공 시 완료 페이지로 이동
   */
  const handleSubmit = async () => {
    if (!validateForm()) {
      // 첫 번째 에러로 스크롤
      const firstErrorField = Object.keys(errors)[0];
      document.getElementById(firstErrorField)?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await authApi.registerBusiness({
        ...initialData,
        ...formData,
      });

      onNext({ ...formData, memberId: response.memberId });
    } catch (err) {
      console.error("회원가입 실패:", err);
      setErrors({
        submit: err.message || "회원가입에 실패했습니다. 다시 시도해주세요.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 완료 버튼 활성화 조건
  const canSubmit =
    formData.password &&
    formData.passwordConfirm &&
    formData.birthDate &&
    formData.gender &&
    formData.name &&
    formData.nickname &&
    isNicknameValid;

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-8 border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          기본정보 입력하기
        </h1>
      </div>

      {errors.submit && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{errors.submit}</p>
        </div>
      )}

      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <span className="w-32 text-sm font-medium text-gray-600">소속명</span>
          <span className="flex-1 text-sm font-semibold text-gray-900">
            {initialData?.companyName || "724펜"}
          </span>
        </div>
        <div className="flex items-center gap-4 pt-3">
          <span className="w-32 text-sm font-medium text-gray-600">
            소속 이메일
          </span>
          <span className="flex-1 text-sm font-semibold text-gray-900">
            {initialData?.email || "example@gmail.com"}
          </span>
        </div>
        <div id="password" className="flex items-start gap-4">
          <label className="w-32 pt-3 text-sm font-medium text-gray-600 flex-shrink-0">
            비밀번호
          </label>
          <div className="flex-1">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                placeholder="비밀번호 (최소 8자 이상)"
                className="px-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            {formData.password && (
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      passwordStrength.level === 1
                        ? "w-1/3 bg-red-500"
                        : passwordStrength.level === 2
                          ? "w-2/3 bg-yellow-500"
                          : "w-full bg-green-500"
                    }`}
                  />
                </div>
                <span
                  className={`text-sm font-medium ${passwordStrength.color}`}
                >
                  {passwordStrength.text}
                </span>
              </div>
            )}

            {errors.password && (
              <p className="text-sm text-red-500 mt-2">{errors.password}</p>
            )}
          </div>
        </div>

        <div id="passwordConfirm" className="flex items-start gap-4">
          <label className="w-32 pt-3 text-sm font-medium text-gray-600 flex-shrink-0">
            비밀번호 확인
          </label>
          <div className="flex-1">
            <div className="relative">
              <input
                type={showPasswordConfirm ? "text" : "password"}
                value={formData.passwordConfirm}
                onChange={(e) =>
                  handleChange("passwordConfirm", e.target.value)
                }
                placeholder="비밀번호 재입력"
                className="px-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPasswordConfirm ? "🙈" : "👁️"}
              </button>
            </div>
            {errors.passwordConfirm && (
              <p className="text-sm text-red-500 mt-2">
                {errors.passwordConfirm}
              </p>
            )}
          </div>
        </div>

        <div id="birthDate" className="flex flex-end gap-4">
          <label className="w-32 pt-3 text-sm font-medium text-gray-600 flex-shrink-0">
            생년월일
          </label>
          <div className="flex-1">
            <BirthDatePicker
              value={formData.birthDate}
              onChange={(date) => {
                setFormData({ ...formData, birthDate: date });
                // 에러 초기화
                if (errors.birthDate) {
                  setErrors({ ...errors, birthDate: "" });
                }
              }}
            />
          </div>
        </div>

        <div id="gender" className="flex items-start gap-4">
          <label className="w-32 text-sm font-medium text-gray-600 flex-shrink-0">
            성별
          </label>
          <div className="flex-1">
            <div className="flex gap-4 ">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={formData.gender === "female"}
                  onChange={(e) => handleChange("gender", e.target.value)}
                  className="w-4 h-4"
                />
                <span className="mr-4">여자</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={formData.gender === "male"}
                  onChange={(e) => handleChange("gender", e.target.value)}
                  className="w-4 h-4"
                />
                <span>남자</span>
              </label>
            </div>
            {errors.gender && (
              <p className="text-sm text-red-500 mt-2">{errors.gender}</p>
            )}
          </div>
        </div>

        <div id="name" className="flex items-start gap-4">
          <label className="w-32 pt-3 text-sm font-medium text-gray-600 flex-shrink-0">
            이름
          </label>
          <div className="flex-1">
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="이름 입력"
              className="px-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-2">{errors.name}</p>
            )}
          </div>
        </div>

        <div id="nickname" className="flex items-start gap-4">
          <label className="w-32 pt-3 text-sm font-medium text-gray-600 flex-shrink-0">
            닉네임
          </label>
          <div className="flex-1">
            <NicknameInput
              value={formData.nickname}
              onChange={(value) => handleChange("nickname", value)}
              onValidationChange={setIsNicknameValid}
            />
            {errors.nickname && (
              <p className="text-sm text-red-500 mt-1">{errors.nickname}</p>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!canSubmit || isSubmitting}
        className={`mt-8 py-4 w-full rounded-lg font-semibold transition-colors ${
          canSubmit && !isSubmitting
            ? "bg-blue-500 text-white hover:bg-blue-600"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        {isSubmitting ? "가입 중..." : "가입하기"}
      </button>
    </div>
  );
}
