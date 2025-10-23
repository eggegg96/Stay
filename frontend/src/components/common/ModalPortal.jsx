import { createPortal } from "react-dom";

/**
 * Modal Portal 컴포넌트
 *
 * 역할:
 * - React Portal을 사용하여 모달을 DOM 계층 구조 밖에서 렌더링
 * - #modal-root 요소가 없으면 자동 생성
 *
 * 왜 Portal이 필요한가?
 * - z-index 문제 해결: 부모의 overflow, z-index에 영향받지 않음
 * - 접근성: 모달이 DOM 최상위에 위치하여 포커스 관리 용이
 * - 스타일 격리: 부모 컴포넌트의 CSS에 영향받지 않음
 */

// modal-root 확보 (없으면 생성)
function ensureModalRoot() {
  // SSR 환경 체크
  if (typeof window === "undefined") return null;

  let el = document.getElementById("modal-root");

  if (!el) {
    el = document.createElement("div");
    el.id = "modal-root";
    document.body.appendChild(el);

    // 개발 환경에서 로그
    if (import.meta.env.DEV) {
      console.log("✓ modal-root element created");
    }
  }

  return el;
}

export default function ModalPortal({ children }) {
  const el = ensureModalRoot();

  // SSR 대비 - 서버에서는 null 반환
  if (!el) return null;

  return createPortal(children, el);
}
