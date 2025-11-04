import { useEffect, useState } from "react";
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import BookingPopover from "./BookingPopover";
import { formatRangeKR } from "@utils/dateText";

export default function SearchForm({
  state,
  onSubmit,
  area = "domestic",
  initialActive = "place",
  isDetailPage = false,
}) {
  const {
    keyword,
    setKeyword,
    range,
    setRange,
    adults,
    setAdults,
    children,
    setChildren,
    childrenAges,
    updateChildAge,
    rooms,
    setRooms,
    open,
    setOpen,
    pickerRef,
  } = state;

  const [openBooking, setOpenBooking] = useState(false);

  useEffect(() => {
    if (initialActive === "date") {
      setOpen(true);
      setOpenBooking(false);
    } else if (initialActive === "guests") {
      setOpen(false);
      setOpenBooking(true);
    } else {
      setOpen(false);
      setOpenBooking(false);
    }
  }, [initialActive, setOpen]);

  const isValid = isDetailPage ? true : keyword.trim().length > 0;

  const submit = () => {
    if (!isValid) return;

    const validChildrenAges = childrenAges
      .filter((age) => age && age !== "" && !Array.isArray(age))
      .filter(Boolean);

    const payload = {
      base: area === "overseas" ? "overseas" : "domestic",
      keyword: keyword.trim(),
      checkIn: format(range[0].startDate, "yyyy-MM-dd"),
      checkOut: format(range[0].endDate, "yyyy-MM-dd"),
      adults: Number(adults),
      children: area === "overseas" ? validChildrenAges.join(",") : undefined, // 🔥 이 부분이 핵심!
      rooms: Number(rooms),
    };

    childrenAges.forEach((age, index) => {
      console.log(`[${index}]:`, age, typeof age, Array.isArray(age));
    });

    onSubmit(payload);
  };

  // 예약 옵션 텍스트 생성
  const getBookingText = () => {
    if (area === "overseas") {
      const childrenText = Number(children) > 0 ? ` · 아동 ${children}명` : "";
      return `성인 ${adults}명${childrenText} · 객실 ${rooms}개`;
    } else {
      return `인원 ${adults}명`;
    }
  };

  return (
    <div className="grid grid-cols-1 col-span-3 sm:grid-cols-8 gap-2 bg-white">
      {/* 키워드 입력 필드 */}
      <input
        className="col-span-3 p-3 rounded-lg bg-gray-100 outline-none focus:ring-1 focus:ring-black-300 focus:bg-white"
        type="text"
        placeholder={
          isDetailPage
            ? "다른 숙소 검색하기"
            : area === "overseas"
            ? "도시를 입력하세요 예) 도쿄 오사카 후쿠오카"
            : "도시를 입력하세요 예) 서울 제주도 부산"
        }
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />

      {/* 날짜 선택 */}
      <div className="relative col-span-2">
        <button
          type="button"
          onClick={() => {
            setOpen(!open);
            setOpenBooking(false);
          }}
          className="w-full p-3 rounded-lg text-left bg-gray-100 cursor-pointer outline-none focus:ring-1 focus:ring-black-300 focus:bg-white whitespace-nowrap overflow-hidden text-ellipsis"
        >
          {formatRangeKR(range[0].startDate, range[0].endDate)}
        </button>

        {open && (
          <div
            ref={pickerRef}
            className="absolute top-15 border border-slate-200 rounded-xl text-left bg-gray-100 outline-none focus:ring-1 focus:ring-black-300 focus:bg-white z-50"
          >
            <DateRange
              ranges={range}
              onChange={(item) => setRange([item.selection])}
              moveRangeOnFirstSelection={false}
              months={2}
              direction="horizontal"
              showDateDisplay={false}
              minDate={new Date()}
              locale={ko}
              rangeColors={["#3b82f6"]}
            />
          </div>
        )}
      </div>

      {/* 인원/예약 선택 */}
      <div className="relative col-span-2">
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setOpenBooking(!openBooking);
          }}
          className="w-full p-3 rounded-lg text-left bg-gray-100 outline-none focus:ring-1 focus:ring-black-300 focus:bg-white"
        >
          {getBookingText()}
        </button>

        <BookingPopover
          open={openBooking}
          onClose={() => setOpenBooking(false)}
          adults={adults}
          setAdults={setAdults}
          children={children}
          setChildren={setChildren}
          childrenAges={childrenAges}
          updateChildAge={updateChildAge}
          rooms={rooms}
          setRooms={setRooms}
          area={area}
        />
      </div>

      {/* 검색 버튼 */}
      <button
        type="button"
        onClick={submit}
        disabled={!isValid}
        className="rounded-lg p-3 col-span-1 text-white cursor-pointer bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300"
      >
        검색
      </button>
    </div>
  );
}
