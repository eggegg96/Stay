import { useState } from "react";

export default function BusinessTermsAgreementStep({ onNext }) {
  const [agreements, setAgreements] = useState({
    all: false,
    terms: false, // 필수: 이용약관 동의
    personalInfo: false, // 필수: 개인정보 수집 및 이용 동의
    thirdParty: false, // 필수: 개인정보 제3자 제공 동의
    marketing: false, // 선택: 마케팅 알림 수신 동의
    location: false, // 선택: 위치정보 이용약관 동의
  });

  const [error, setError] = useState("");

  const handleAllCheck = (checked) => {
    setAgreements({
      all: checked,
      terms: checked,
      personalInfo: checked,
      thirdParty: checked,
      marketing: checked,
      location: checked,
    });
    setError("");
  };

  const handleCheck = (name, checked) => {
    const newAgreements = { ...agreements, [name]: checked };

    // 전체 동의는 모든 항목이 체크되어야 함
    newAgreements.all =
      newAgreements.terms &&
      newAgreements.personalInfo &&
      newAgreements.thirdParty &&
      newAgreements.marketing &&
      newAgreements.location;

    setAgreements(newAgreements);
    setError("");
  };

  const handleNext = () => {
    // 필수 약관 체크 확인
    if (
      !agreements.terms ||
      !agreements.personalInfo ||
      !agreements.thirdParty
    ) {
      setError("필수 약관에 모두 동의해주세요.");
      return;
    }

    // 다음 단계로 (휴대폰 인증)
    onNext();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          여기어때 약관 동의
        </h1>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg p-6 space-y-4">
        <label className="flex items-center gap-3 p-4 border-b-2 border-gray-300 cursor-pointer hover:bg-gray-50">
          <input
            type="checkbox"
            checked={agreements.all}
            onChange={(e) => handleAllCheck(e.target.checked)}
            className="w-5 h-5 rounded border-gray-300 text-blue-500 focus:ring-2 focus:ring-blue-500 cursor-pointer"
          />
          <span className="font-bold text-lg">
            전체 동의{" "}
            <span className="text-sm text-gray-500 font-normal">
              (선택 항목 포함)
            </span>
          </span>
        </label>

        <div className="space-y-3 pl-2">
          <label className="flex items-center justify-between gap-3 p-3 cursor-pointer hover:bg-gray-50 rounded">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={agreements.terms}
                onChange={(e) => handleCheck("terms", e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-blue-500 focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-gray-800">
                이용약관 동의{" "}
                <span className="text-red-500 font-medium">(필수)</span>
              </span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                alert("이용약관 상세 내용 (추후 모달 구현)");
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              →
            </button>
          </label>
          <label className="flex items-center justify-between gap-3 p-3 cursor-pointer hover:bg-gray-50 rounded">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={agreements.personalInfo}
                onChange={(e) => handleCheck("personalInfo", e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-blue-500 focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-gray-800">
                개인정보 수집 및 이용 동의{" "}
                <span className="text-red-500 font-medium">(필수)</span>
              </span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                alert("개인정보 수집 및 이용 동의 상세 내용 (추후 모달 구현)");
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              →
            </button>
          </label>
          <label className="flex items-center justify-between gap-3 p-3 cursor-pointer hover:bg-gray-50 rounded">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={agreements.thirdParty}
                onChange={(e) => handleCheck("thirdParty", e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-blue-500 focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-gray-800">
                개인정보 제3자 제공 동의{" "}
                <span className="text-red-500 font-medium">(필수)</span>
              </span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                alert("개인정보 제3자 제공 동의 상세 내용 (추후 모달 구현)");
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              →
            </button>
          </label>
          <label className="flex items-center justify-between gap-3 p-3 cursor-pointer hover:bg-gray-50 rounded">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={agreements.marketing}
                onChange={(e) => handleCheck("marketing", e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-blue-500 focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-gray-800">
                마케팅 알림 수신 동의{" "}
                <span className="text-gray-500 font-normal">(선택)</span>
              </span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                alert("마케팅 알림 수신 동의 상세 내용 (추후 모달 구현)");
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              →
            </button>
          </label>
          <label className="flex items-center justify-between gap-3 p-3 cursor-pointer hover:bg-gray-50 rounded">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={agreements.location}
                onChange={(e) => handleCheck("location", e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-blue-500 focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-gray-800">
                위치정보 이용약관 동의{" "}
                <span className="text-gray-500 font-normal">(선택)</span>
              </span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                alert("위치정보 이용약관 동의 상세 내용 (추후 모달 구현)");
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              →
            </button>
          </label>
        </div>
      </div>
      <button
        onClick={handleNext}
        className="w-full mt-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
      >
        다음
      </button>
    </div>
  );
}
