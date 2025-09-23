import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Hot from "../components/HotAccommodation";
import Event from "../components/Event";
import HotPoint from "../components/Hotpoint";
import useHomeSearchState from "../hooks/useHomeSearchState";
import SearchForm from "../components/search/SearchForm";

export default function Home() {
  const categories = ["국내 숙소", "해외 숙소"];
  const [active, setActive] = useState("국내 숙소");
  const nav = useNavigate();
  const s = useHomeSearchState();

  const go = (p) => {
    // HeaderContext 업데이트 제거 - Header의 handleSubmit에서 처리하도록 함

    // URL 이동만 수행
    const qs = new URLSearchParams({
      keyword: p.keyword,
      checkIn: p.checkIn,
      checkOut: p.checkOut,
      people: p.people,
      rooms: p.rooms,
    }).toString();

    nav(`/${p.base}?${qs}`);
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

              <div className="mt-6 rounded-2xl border-slate-200 bg-white backdrop-blur p-6 pt-4 shadow-xl">
                {/* 국내 해외 선택 */}
                <div className="mb-3 flex flex-wrap">
                  {categories.map((cat) => (
                    <span
                      key={cat}
                      onClick={() => setActive(cat)}
                      className={`text-base md:text-lg p-2 cursor-pointer mb-1 ${
                        active === cat
                          ? "border-b-2 text-blue-500 border-blue-500 font-semibold"
                          : "opacity-80 hover:opacity-100 hover:bg-gray-100 border-b border-[#E0E0E0]"
                      }`}
                    >
                      {cat}
                    </span>
                  ))}
                </div>
                <SearchForm
                  state={s}
                  onSubmit={go}
                  variant="hero"
                  area={active === "해외 숙소" ? "overseas" : "domestic"}
                />
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
