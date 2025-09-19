import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

import Hot from "../components/HotAccommodation";
import Event from "../components/Event";
import HotPoint from "../components/Hotpoint";

export default function Home() {
  const categories = ["국내 숙소", "해외 숙소"];
  const [active, setActive] = useState("국내 숙소");
  const [keyword, setKeyword] = useState("");
  const [adults, setAdults] = useState("2");
  const rooms = "1";
  const nav = useNavigate();

  // 달력 상태
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
      key: "selection",
    },
  ]);
  const [open, setOpen] = useState(false);
  const pickerRef = useRef(null);

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const checkIn = format(range[0].startDate, "yyyy-MM-dd");
  const checkOut = format(range[0].endDate, "yyyy-MM-dd");
  const isValid = keyword.trim().length > 0; // 빈 문자열만 막기

  function toSlug(s = "") {
    return String(s)
      .trim()
      .replace(/\s+/g, " ")
      .toLowerCase()
      .replace(/\s/g, "-");
  }

  const handleSearch = () => {
    if (!isValid) return;
    const base = active === "해외 숙소" ? "overseas" : "domestic";
    const qs = new URLSearchParams({
      city: keyword.trim(), // ✅ 사용자가 입력한 그대로 보냄
      checkIn,
      checkOut,
      adults,
      rooms,
      // 필요하면 citySlug도 함께 보낼 수 있음:
      // citySlug: toSlug(keyword.trim()),
    }).toString();
    nav(`/${base}?${qs}`);
  };

  return (
    <>
      <section
        className="relative h-[380px] md:h-[440px] bg-cover bg-center"
        style={{ backgroundImage: "url('/images/bg2.webp')" }}
      >
        <div className="absolute inset-0 bg-black/35" />
        <div className="relative z-10 flex h-full w-full items-center">
          <div className="w-full px-4 sm:px-6 lg:px-12">
            <div className="mx-auto max-w-6xl">
              <h1 className="text-center text-2xl md:text-3xl font-bold text-white cursor-default">
                전주 한옥부터 서울 호텔까지 여행할 땐 Stay
              </h1>

              <div className="mt-6 rounded-2xl border border-slate-200 bg-white/95 backdrop-blur p-6 shadow-xl">
                {/* 카테고리 */}
                <div className="mb-3 flex flex-wrap gap-4">
                  {categories.map((cat) => (
                    <span
                      key={cat}
                      onClick={() => setActive(cat)}
                      className={`text-base md:text-lg p-2 pb-3 cursor-pointer
                        ${
                          active === cat
                            ? "border-b-2 text-blue-500 border-blue-500 font-semibold"
                            : "opacity-80 hover:opacity-100 hover:bg-gray-100"
                        }`}
                    >
                      {cat}
                    </span>
                  ))}
                </div>

                {/* 검색폼 */}
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                  {/* 도시 입력 */}
                  <input
                    className="col-span-2 p-3 border rounded-lg"
                    type="text"
                    placeholder="도시를 입력하세요 예) 서울 도쿄 부산"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                  />

                  {/* 달력 팝업 */}
                  <div className="relative">
                    <button
                      onClick={() => setOpen((prev) => !prev)}
                      className="w-full p-3 border rounded-lg text-left hover:bg-gray-100"
                    >
                      {format(range[0].startDate, "MM.dd")} -{" "}
                      {format(range[0].endDate, "MM.dd")} (
                      {Math.max(
                        1,
                        (range[0].endDate - range[0].startDate) /
                          (1000 * 60 * 60 * 24)
                      )}
                      박)
                    </button>

                    {open && (
                      <div
                        ref={pickerRef}
                        className="absolute top-14 z-50 bg-white border rounded-xl shadow-xl"
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

                  {/* 인원 선택 */}
                  <select
                    className="p-3 border rounded-lg cursor-pointer"
                    value={adults}
                    onChange={(e) => setAdults(e.target.value)}
                  >
                    <option value="1">성인 1명</option>
                    <option value="2">성인 2명</option>
                    <option value="3">성인 3명</option>
                    <option value="4">성인 4명</option>
                  </select>

                  {/* 버튼 */}
                  <button
                    onClick={handleSearch}
                    disabled={!isValid}
                    className={`rounded-lg p-3 text-white cursor-pointer ${
                      isValid ? "bg-blue-500 hover:bg-blue-600" : "bg-blue-300"
                    }`}
                  >
                    숙소 찾기
                  </button>
                </div>

                <div className="mt-2 text-xs text-slate-500">
                  서울 제주도 부산 강릉 인천 경주 도쿄 오사카 후쿠오카 다낭
                  나트랑 괌
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-15">
        <div className="mx-auto max-w-7xl">
          <HotPoint />
        </div>
      </section>
      <section className="pt-15">
        <div className="mx-auto max-w-7xl">
          <Event />
        </div>
      </section>
      <section className="pt-15">
        <div className="mx-auto max-w-7xl">
          <Hot />
        </div>
      </section>
    </>
  );
}
