import { useEffect } from "react";

/**
 * 바디 스크롤 잠금 훅
 *
 * 역할:
 * - 모달이 열릴 때 배경 스크롤 방지
 * - 모달이 닫힐 때 원래 상태로 복원
 *
 * 왜 필요한가?
 * - 모달 뒤 배경이 스크롤되면 UX가 나쁨
 * - 특히 모바일에서 배경 스크롤 방지 필수
 *
 * @param {boolean} active - 스크롤 잠금 활성화 여부
 */
export default function useLockBodyScroll(active) {
  useEffect(() => {
    // active가 false면 아무것도 하지 않음
    if (!active) return;

    // 현재 상태 저장
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    // 스크롤바 너비 계산 (스크롤바가 사라질 때 레이아웃 shift 방지)
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    // 스크롤 잠금
    document.body.style.overflow = "hidden";

    // 스크롤바가 있었다면 padding으로 보정
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    // cleanup: 원래 상태로 복원
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [active]);
}
