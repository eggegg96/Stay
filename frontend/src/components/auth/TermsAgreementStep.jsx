import { useState } from "react";

export default function TermsAgreementStep({ onNext }) {
  const [agreements, setAgreements] = useState({
    all: false,
    terms: false,
    age14: false,
    personalInfo: false,
    marketing: false,
    location: false,
  });

  // 전체 동의 체크박스 핸들러
  const handleAllCheck = (checked) => {
    setAgreements({
      all: checked,
      terms: checked,
      age14: checked,
      personalInfo: checked,
      marketing: checked,
      location: checked,
    });
  };

  // 개별 체크박스 핸들러
  const handleCheck = (name, checked) => {
    const newAgreements = { ...agreements, [name]: checked };

    // 전체 동의는 모든 항목이 체크되어야 함
    newAgreements.all =
      newAgreements.terms &&
      newAgreements.age14 &&
      newAgreements.personalInfo &&
      newAgreements.marketing &&
      newAgreements.location;

    setAgreements(newAgreements);
  };

  // 필수 항목 체크 여부 (선택 항목 제외)
  const canProceed =
    agreements.terms && agreements.age14 && agreements.personalInfo;

  return (
    <div className="max-w-2xl mx-auto">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          초면에 실례지만,
        </h1>
        <h2 className="text-3xl font-bold text-gray-900">
          약관 동의가 필요해요.
        </h2>
      </div>

      {/* 약관 동의 폼 */}
      <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
        {/* 전체 동의 */}
        <label className="flex items-center gap-3 p-4 border-b-2 cursor-pointer">
          <input
            type="checkbox"
            checked={agreements.all}
            onChange={(e) => handleAllCheck(e.target.checked)}
            className="w-5 h-5 rounded border-gray-300 text-blue-500 focus:ring-2 focus:ring-blue-500"
          />
          <span className="font-bold text-lg">
            약관 전체동의{" "}
            <span className="text-sm text-gray-500">선택항목 포함</span>
          </span>
        </label>

        {/* 개별 약관 */}
        <div className="space-y-3">
          {/* 필수: 이용약관 */}
          <label className="flex items-center justify-between gap-3 p-3 cursor-pointer hover:bg-gray-50 rounded">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={agreements.terms}
                onChange={(e) => handleCheck("terms", e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-blue-500 focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-800">(필수) 이용약관</span>
            </div>
            <button type="button" className="text-gray-400 hover:text-gray-600">
              →
            </button>
          </label>

          {/* 필수: 만 14세 이상 확인 */}
          <label className="flex items-center justify-between gap-3 p-3 cursor-pointer hover:bg-gray-50 rounded">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={agreements.age14}
                onChange={(e) => handleCheck("age14", e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-blue-500 focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-800">(필수) 만 14세 이상 확인</span>
            </div>
            <button type="button" className="text-gray-400 hover:text-gray-600">
              →
            </button>
          </label>

          {/* 필수: 개인정보 수집 및 이용 동의 */}
          <label className="flex items-center justify-between gap-3 p-3 cursor-pointer hover:bg-gray-50 rounded">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={agreements.personalInfo}
                onChange={(e) => handleCheck("personalInfo", e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-blue-500 focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-800">
                (필수) 개인정보 수집 및 이용 동의
              </span>
            </div>
            <button type="button" className="text-gray-400 hover:text-gray-600">
              →
            </button>
          </label>

          {/* 선택: 마케팅 알림 수신 동의 */}
          <label className="flex items-center justify-between gap-3 p-3 cursor-pointer hover:bg-gray-50 rounded">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={agreements.marketing}
                onChange={(e) => handleCheck("marketing", e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-blue-500 focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-800">
                (선택) 마케팅 알림 수신 동의
              </span>
            </div>
            <button type="button" className="text-gray-400 hover:text-gray-600">
              →
            </button>
          </label>

          {/* 선택: 위치기반 서비스 이용약관 동의 */}
          <label className="flex items-center justify-between gap-3 p-3 cursor-pointer hover:bg-gray-50 rounded">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={agreements.location}
                onChange={(e) => handleCheck("location", e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-blue-500 focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-800">
                (선택) 위치기반 서비스 이용약관 동의
              </span>
            </div>
            <button type="button" className="text-gray-400 hover:text-gray-600">
              →
            </button>
          </label>
        </div>
      </div>

      {/* 다음 버튼 */}
      <button
        onClick={onNext}
        disabled={!canProceed}
        className={`w-full mt-6 py-4 rounded-lg font-semibold transition-colors ${
          canProceed
            ? "bg-blue-500 text-white hover:bg-blue-600"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        다음
      </button>
    </div>
  );
}
