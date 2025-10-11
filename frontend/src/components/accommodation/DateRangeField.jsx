import { useEffect, useRef, useState } from "react";
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { DATE_CONSTANTS } from "@/constants";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

export default function DateRangeField({ value, onChange }) {
  // value: { startDate: Date|null, endDate: Date|null }
  const [open, setOpen] = useState(false);
  const [range, setRange] = useState([
    {
      startDate: value?.startDate || new Date(),
      endDate: value?.endDate || new Date(),
      key: "selection",
    },
  ]);

  const popRef = useRef(null);

  useEffect(() => {
    function closeOnOutside(e) {
      if (popRef.current && !popRef.current.contains(e.target)) setOpen(false);
    }
    function closeOnEsc(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", closeOnOutside);
    document.addEventListener("keydown", closeOnEsc);
    return () => {
      document.removeEventListener("mousedown", closeOnOutside);
      document.removeEventListener("keydown", closeOnEsc);
    };
  }, []);

  // 버튼 라벨
  const label =
    range[0].startDate && range[0].endDate
      ? `${format(range[0].startDate, "MM.dd(E)", { locale: ko })} - ${format(
          range[0].endDate,
          "MM.dd(E)",
          { locale: ko }
        )} (${Math.max(
          1,
          Math.round(
            (range[0].endDate - range[0].startDate) / DATE_CONSTANTS.ONE_DAY_MS
          )
        )}박)`
      : "날짜 선택";

  return (
    <div className="relative" ref={popRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="h-12 rounded-xl border px-4 text-sm font-medium hover:bg-slate-50"
      >
        {label}
      </button>

      {open && (
        <div className="absolute z-50 mt-2 rounded-2xl border bg-white p-3 shadow-xl">
          <DateRange
            ranges={range}
            onChange={(item) => setRange([item.selection])}
            moveRangeOnFirstSelection={false}
            months={2}
            direction="horizontal"
            showDateDisplay={false}
            minDate={new Date()}
            locale={ko}
            rangeColors={["#ff2b85"]}
          />

          <div className="flex justify-end gap-2 px-2 pb-2">
            <button
              className=" px-3 py-2 text-sm hover:bg-slate-100"
              onClick={() => setOpen(false)}
            >
              닫기
            </button>
            <button
              className=" bg-[#ff2b85] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
              onClick={() => {
                onChange?.({
                  startDate: range[0].startDate,
                  endDate: range[0].endDate,
                });
                setOpen(false);
              }}
            >
              적용
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
