import { useEffect, useCallback } from "react";
import ModalPortal from "@/components/common/ModalPortal";
import useLockBodyScroll from "@/hooks/useLockBodyScroll";

export default function BusinessCompanyConfirmStep({
  companyInfo,
  onBack,
  onNext,
}) {
  // 바디 스크롤 잠금
  useLockBodyScroll(true);

  /**
   * Escape 키 핸들러
   * useCallback으로 메모이제이션 (불필요한 리렌더링 방지)
   */
  const handleEscape = useCallback(
    (e) => {
      if (e.key === "Escape") {
        onBack();
      }
    },
    [onBack]
  );

  // Escape 키 이벤트 등록
  useEffect(() => {
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [handleEscape]);

  /**
   * 배경 클릭 핸들러
   * 이벤트 버블링 방지를 위해 별도 함수로 분리
   */
  const handleBackdropClick = (e) => {
    // 배경 클릭만 감지 (모달 내부 클릭은 무시)
    if (e.target === e.currentTarget) {
      onBack();
    }
  };

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-[1000]">
        <div
          onClick={handleBackdropClick}
          className="absolute inset-0 bg-slate-200/70 backdrop-blur-[2px] cursor-pointer"
          aria-hidden="true"
        />
        <div className="absolute inset-x-0 bottom-0 p-4 md:inset-0 md:flex md:items-center md:justify-center md:p-6">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            aria-describedby="confirm-description"
            className="bg-white rounded-lg p-6 max-w-sm w-full shadow-2xl border border-gray-200 mx-auto relative z-10"
          >
            <div className="mb-6">
              <h2
                id="confirm-title"
                className="text-lg font-bold text-gray-900 mb-4"
              >
                <span className="text-blue-600">{companyInfo.companyName}</span>
                (을) 선택하셨습니다.
              </h2>
              <div id="confirm-description">
                <p className="text-sm text-gray-600 mb-2">
                  선택하신 소속이 맞나요?
                </p>
                <p className="text-xs text-gray-500">
                  가입 후 소속 변경은 어려우니 한번 더 확인해 주세요.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onBack}
                className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                aria-label="소속 선택 취소"
              >
                취소
              </button>
              <button
                onClick={onNext}
                className="flex-1 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
                aria-label="소속 선택 확인"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}
