// AmenityModal.jsx
import { useEffect } from "react";

export default function AmenityModal({ open, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    if (open) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", onKey);
    }
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-[560px] max-w-[92vw] rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">서비스 및 부대시설</h2>
          <button onClick={onClose} aria-label="닫기" className="p-2">
            ✕
          </button>
        </div>
        <ul className="mt-4 grid grid-cols-3 gap-6 text-center">
          <li>스파/월풀</li>
          <li>무선인터넷</li>
          <li>주차장</li>
          <li>반신욕</li>
          <li>거울룸</li>
          <li>트윈베드</li>
        </ul>
      </div>
    </div>
  );
}
