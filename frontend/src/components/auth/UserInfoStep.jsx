import { useState } from "react";

export default function UserInfoStep({ onNext }) {
  const [formData, setFormData] = useState({
    year: "",
    month: "",
    day: "",
    gender: "",
    nickname: "",
  });

  const years = Array.from({ length: 100 }, (_, i) => 2025 - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 만 14세 이상 확인
  const isOver14 = () => {
    if (!formData.year || !formData.month || !formData.day) return true; // 미입력 시 체크 안 함

    const today = new Date();
    const birthDate = new Date(formData.year, formData.month - 1, formData.day);

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // 생일이 아직 안 지났으면 나이 -1
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age >= 14;
  };

  const canProceed =
    formData.year &&
    formData.month &&
    formData.day &&
    formData.gender &&
    formData.nickname &&
    formData.nickname.length >= 3 &&
    isOver14();

  const handleSubmit = () => {
    if (!canProceed) return;
    // TODO: 실제 회원가입 API
    console.log("회원가입 데이터:", formData);
    onNext();
  };

  return (
    <div className="max-w-md mx-auto mt-12">
      {/* 헤더 */}
      <div className="py-3">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          필수 정보 입력
        </h1>
        <p className="text-slate-500">가입을 위해 필수 정보를 입력해 주세요.</p>
      </div>

      {/* 정보 입력 폼 */}
      <div className="space-y-4">
        {/* 생년월일 */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-2">
            생년월일<span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-3">
            {/* 년도 */}
            <select
              value={formData.year}
              onChange={(e) => handleChange("year", e.target.value)}
              className="px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
              className="px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
              className="px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
          <label className="block text-sm font-semibold text-gray-600">
            성별<span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-4 py-2">
            {/* 여자 */}
            <label
              className={`flex items-center justify-center px-4 cursor-pointer`}
            >
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
            <label
              className={`flex items-center justify-center px-4 cursor-pointer`}
            >
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

        {/* 닉네임 */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-2">
            닉네임<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.nickname}
            onChange={(e) => handleChange("nickname", e.target.value)}
            placeholder="닉네임을 입력하세요"
            maxLength={8}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-sm text-gray-500 mt-2">
            3~8자 이내로 입력해주세요
          </p>
        </div>
      </div>

      {/* 완료 버튼 */}
      <button
        onClick={handleSubmit}
        disabled={!canProceed}
        className={`w-full mt-4 py-4 rounded-lg font-semibold transition-colors ${
          canProceed
            ? "bg-blue-500 text-white hover:bg-blue-600"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        확인
      </button>
    </div>
  );
}
