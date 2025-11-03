import { useState } from "react";
import BusinessCompanyConfirmStep from "./BusinessCompanyConfirm";

export default function BusinessCompanySelectStep({ initialData, onNext }) {
  const [selectedCompany, setSelectedCompany] = useState(
    initialData?.companyName || ""
  );
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [tempCompanyData, setTempCompanyData] = useState(null);

  /**
   * 임시 회사 목록 (실제로는 백엔드에서 가져옴)
   *
   * TODO: 백엔드 API 연동
   * GET /api/business/companies
   * 응답: [
   *   { id: 1, name: "(사) 대한물리치료사협회 경남도회", businessNumber: "123-45-67890" },
   *   ...
   * ]
   */
  const companyList = [
    { id: 1, name: "(사) 대한물리치료사협회 경남도회" },
    { id: 2, name: "(사)대한산업안전협회" },
    { id: 3, name: "(유) 승현" },
    { id: 4, name: "(유)글로벌해외관광" },
    { id: 5, name: "(재)국립극장진흥재단" },
    { id: 6, name: "(주)무동기업" },
    { id: 7, name: "(주)버엔드케어" },
    { id: 8, name: "(주)서경앤장" },
    { id: 9, name: "(주)썬원티엔티" },
    { id: 10, name: "(주)앨앤에프툴" },
    { id: 11, name: "(주)엠드케어" },
    { id: 12, name: "(주)워딘" },
    { id: 13, name: "(주)유니버셜리프로덕트엑히비지코리아" },
    { id: 14, name: "(주)인드라" },
    { id: 15, name: "(주)제이플러스" },
  ];

  const handleCompanyChange = (e) => {
    setSelectedCompany(e.target.value);
    setError(""); // 선택 시 에러 초기화
  };

  /**
   * 다음 버튼 클릭 시 확인 모달 표시
   *
   * 프로세스:
   * 1. 소속 선택 확인
   * 2. 백엔드에서 사업자등록번호 조회 (실제로는)
   * 3. 확인 모달 표시
   */
  const handleNext = async (e) => {
    e.preventDefault();

    // 유효성 검증
    if (!selectedCompany) {
      setError("소속을 선택해주세요.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // TODO: 백엔드에서 선택한 회사의 상세 정보 조회
      // GET /api/business/companies/{companyName}
      // 응답: { name, businessNumber, address, ... }

      console.log("선택한 소속:", selectedCompany);

      // 임시: 1초 대기
      await new Promise((resolve) => setTimeout(resolve, 500));

      // 임시 데이터 저장 (실제로는 백엔드에서 받아옴)
      const companyData = {
        companyName: selectedCompany,
        businessNumber: "123-45-67890", // 임시 데이터
      };

      setTempCompanyData(companyData);
      setShowConfirmModal(true); // 확인 모달 표시
    } catch (err) {
      console.error("소속 정보 조회 실패:", err);
      setError(
        err.message || "소속 정보를 불러오는데 실패했습니다. 다시 시도해주세요."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalBack = () => {
    setShowConfirmModal(false);
    setTempCompanyData(null);
  };

  const handleModalConfirm = () => {
    onNext(tempCompanyData);
    setShowConfirmModal(false);
    setTempCompanyData(null);
  };

  return (
    <div className="max-w-md mx-auto relative">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-3">소속 선택하기</h1>
        <p className="text-gray-600">
          소속 회사가 등록되어 있지 않을시
          <br />
          <span className="text-blue-600 font-medium">uyu0326@gmail.com</span>로
          신청 부탁드립니다.
        </p>
      </div>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleNext} className="space-y-6">
        <div>
          <select
            value={selectedCompany}
            onChange={handleCompanyChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white appearance-none cursor-pointer"
            disabled={isLoading || showConfirmModal}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 0.75rem center",
              backgroundSize: "1.5rem",
              paddingRight: "2.5rem",
            }}
          >
            <option value="">소속을 선택해주세요</option>
            {companyList.map((company) => (
              <option key={company.id} value={company.name}>
                {company.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={isLoading || showConfirmModal}
          className="w-full py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? "확인 중..." : "다음"}
        </button>
      </form>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>💡 안내:</strong> 목록에 소속이 없으신가요?
          <br />위 이메일로 사업자등록증을 첨부하여 신청해주세요.
        </p>
      </div>

      {showConfirmModal && tempCompanyData && (
        <BusinessCompanyConfirmStep
          companyInfo={tempCompanyData}
          onBack={handleModalBack}
          onNext={handleModalConfirm}
        />
      )}
    </div>
  );
}
