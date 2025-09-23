import { useEffect, useState } from "react";
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import GuestsPopover from "./GuestsPopover";
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
    people,
    setPeople,
    open,
    setOpen,
    pickerRef,
  } = state;

  const [openGuests, setOpenGuests] = useState(false);

  useEffect(() => {
    if (initialActive === "date") {
      setOpen(true);
      setOpenGuests(false);
    } else if (initialActive === "guests") {
      setOpen(false);
      setOpenGuests(true);
    } else {
      setOpen(false);
      setOpenGuests(false);
    }
  }, [initialActive, setOpen]);

  const isValid = isDetailPage ? true : keyword.trim().length > 0;

  const submit = () => {
    if (!isValid) return;

    const payload = {
      base: area === "overseas" ? "overseas" : "domestic",
      keyword: keyword.trim(),
      checkIn: format(range[0].startDate, "yyyy-MM-dd"),
      checkOut: format(range[0].endDate, "yyyy-MM-dd"),
      people,
      rooms: 1,
    };

    console.log("SearchForm submit payload:", payload);
    onSubmit(payload);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 bg-white">
      {/* 키워드 입력 필드 - 디테일 페이지에서도 수정 가능 */}
      <input
        className="col-span-2 p-3 rounded-lg bg-gray-100 outline-none focus:ring-1 focus:ring-black-300 focus:bg-white"
        type="text"
        placeholder={
          isDetailPage
            ? "다른 숙소 검색하기"
            : "도시를 입력하세요 예) 서울 도쿄 부산"
        }
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />

      <div className="relative">
        <button
          type="button"
          onClick={() => {
            setOpen(!open);
            setOpenGuests(false);
          }}
          className="w-full p-3 rounded-lg text-left bg-gray-100 cursor-pointer outline-none focus:ring-1 focus:ring-black-300 focus:bg-white whitespace-nowrap overflow-hidden text-ellipsis"
        >
          {formatRangeKR(range[0].startDate, range[0].endDate)}
        </button>

        {open && (
          <div
            ref={pickerRef}
            className="absolute top-15 border border-slate-200 rounded-xl text-left bg-gray-100 outline-none focus:ring-1 focus:ring-black-300 focus:bg-white"
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

      <div className="relative">
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setOpenGuests((v) => !v);
          }}
          className="w-full p-3 rounded-lg text-left bg-gray-100 outline-none focus:ring-1 focus:ring-black-300 focus:bg-white"
        >
          인원 {people}
        </button>

        <GuestsPopover
          open={openGuests}
          onClose={() => setOpenGuests(false)}
          people={people}
          setPeople={setPeople}
        />
      </div>

      <button
        type="button"
        onClick={submit}
        disabled={!isValid}
        className="rounded-lg p-3 text-white cursor-pointer bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300"
      >
        검색
      </button>
    </div>
  );
}
