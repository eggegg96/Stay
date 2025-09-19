import { useState } from "react";
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import GuestsPopover from "./GuestsPopover";

export default function SearchForm({
  state, // useHomeSearchState() 리턴값
  onSubmit, // (payload) => void
  variant = "hero", // "hero" | "compact"
  area = "domestic", // "domestic" | "overseas"
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

  const wrapCls =
    variant === "compact"
      ? "grid grid-cols-[1.2fr_1fr_1fr_auto] items-center rounded-full border border-slate-300 overflow-hidden"
      : "grid grid-cols-1 sm:grid-cols-5 gap-2 bg-[#FFFFFF]";

  const inputCls =
    variant === "compact"
      ? "h-11 px-4 text-sm outline-none border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-300 bg-[#EBEBEB] focus:bg-white rounded-lg"
      : "col-span-2 p-3 rounded-lg bg-[#EBEBEB] outline-none border border-transparent focus:ring-1 focus:ring-black-300 focus:bg-white";

  const dateBtnCls =
    variant === "compact"
      ? "h-11 px-4 text-left border-l border-slate-200 hover:bg-gray-50 cursor-pointer"
      : "w-full p-3 rounded-lg text-left bg-[#EBEBEB] cursor-pointer outline-none border border-transparent focus:ring-1 focus:ring-black-300 focus:bg-white";

  const peopleCls =
    variant === "compact"
      ? "h-11 px-4 border-l border-slate-200 cursor-pointer text-left"
      : "w-full p-3 rounded-lg cursor-pointer text-left bg-[#EBEBEB] outline-none border border-transparent focus:ring-1 focus:ring-black-300 focus:bg-white";
  const btnCls =
    variant === "compact"
      ? "h-11 mx-2 my-2 px-5 rounded-full bg-blue-500 text-white font-semibold disabled:bg-blue-300"
      : "rounded-lg p-3 text-white bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300";

  const nights = Math.max(
    1,
    (range[0].endDate - range[0].startDate) / 86400000 // 1000*60*60*24
  );
  const isValid = keyword.trim().length > 0;

  const submit = () => {
    if (!isValid) return;
    onSubmit({
      base: area === "overseas" ? "overseas" : "domestic",
      city: keyword.trim(),
      checkIn: format(range[0].startDate, "yyyy-MM-dd"),
      checkOut: format(range[0].endDate, "yyyy-MM-dd"),
      people,
      rooms: "1",
    });
  };

  return (
    <div className={wrapCls}>
      <input
        className={inputCls}
        type="text"
        placeholder="도시를 입력하세요 예) 서울 도쿄 부산"
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
          className={dateBtnCls}
        >
          {format(range[0].startDate, "MM.dd")} -{" "}
          {format(range[0].endDate, "MM.dd")} ({nights}박)
        </button>
        {open && (
          <div
            ref={pickerRef}
            className="absolute top-12 z-50 bg-white border rounded-xl shadow-xl"
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
            setOpenGuests((v) => !v);
            setOpen(false);
          }}
          className={peopleCls}
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
      <button onClick={submit} disabled={!isValid} className={btnCls}>
        {variant === "compact" ? "검색" : "숙소 찾기"}
      </button>
    </div>
  );
}
