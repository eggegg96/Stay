import { useEffect, useState, useRef } from "react";
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

/**
 * 사업자 회원가입 - 생년월일 선택 컴포넌트
 */
export default function BirthDatePicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    value || new Date(2000, 0, 1) // 기본값: 2000년 1월 1일
  );
  const pickerRef = useRef(null);

  /**
   * 외부 클릭 감지 & 달력 닫기
   */
  useEffect(() => {
    function handleClickOutside(e) {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }

    function handleEscapeKey(e) {
      if (e.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  /**
   * 날짜 선택 핸들러
   */
  const handleDateChange = (item) => {
    const newDate = item.selection.startDate;
    setSelectedDate(newDate);
    onChange?.(newDate);
    setOpen(false); // 날짜 선택 시 자동으로 닫기
  };

  /**
   * 날짜 포맷팅
   * 예: 2000년 1월 1일
   */
  const formatDisplayDate = (date) => {
    return format(date, "yyyy년 MM월 dd일", { locale: ko });
  };

  return (
    <div className="relative" ref={pickerRef}>
      {/* 날짜 선택 버튼 */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-3 text-left border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white hover:bg-gray-50"
      >
        {value ? formatDisplayDate(value) : "생년월일 입력"}
        {/* 달력 아이콘 */}
        <svg
          className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </button>

      {/* 달력 팝업 */}
      {open && (
        <div className="absolute top-full left-0 mt-2 z-50 bg-white rounded-2xl border border-gray-200 shadow-xl p-3">
          <DateRange
            ranges={[
              {
                startDate: selectedDate,
                endDate: selectedDate,
                key: "selection",
              },
            ]}
            onChange={handleDateChange}
            moveRangeOnFirstSelection={false}
            months={1}
            direction="horizontal"
            showDateDisplay={false}
            maxDate={new Date()} // 미래 날짜 선택 불가
            minDate={new Date(1900, 0, 1)} // 1900년부터 선택 가능
            locale={ko}
            rangeColors={["#3b82f6"]} // 파란색
          />
        </div>
      )}
    </div>
  );
}
