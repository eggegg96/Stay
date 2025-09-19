import { useEffect, useRef } from "react";

export default function GuestsPopover({ open, onClose, people, setPeople }) {
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => {
      if (open && ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open, onClose]);

  if (!open) return null;

  const dec = () => setPeople(String(Math.max(1, Number(people) - 1)));
  const inc = () => setPeople(String(Math.min(8, Number(people) + 1)));

  return (
    <div
      ref={ref}
      className="absolute top-12 right-0 z-50 w-[320px] rounded-2xl bg-white shadow p-6 focus:border-slate-500"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-[160px]">
          <div className="text-md font-semibold leading-5">인원</div>
          <p className="mt-1 text-sm text-slate-500 leading-4">
            유아 및 아동도 인원수에 포함해주세요.
          </p>
        </div>
        <div className="flex items-center gap-3 whitespace-nowrap">
          <button
            type="button"
            onClick={dec}
            className="w-8 h-8 rounded-full shadow text-lg leading-none cursor-pointer"
            aria-label="감소"
          >
            −
          </button>
          <span className="w-6 text-center font-bold cursor-default">
            {people}
          </span>
          <button
            type="button"
            onClick={inc}
            className="w-8 h-8 rounded-full shadow text-lg leading-none cursor-pointer"
            aria-label="증가"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
