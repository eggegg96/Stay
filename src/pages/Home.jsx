import { useState } from "react";
import Hot from "../components/HotAccommodation";
import Event from "../components/Event";

export default function Home() {
  const categories = ["국내 숙소", "해외 숙소"];
  const [active, setActive] = useState("국내 숙소");

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
              <h1 className="text-center text-2xl md:text-3xl font-bold text-white">
                전주 한옥부터 서울 호텔까지 여행할 땐 Stay
              </h1>

              <div className="mt-6 rounded-2xl border border-slate-200 bg-white/95 backdrop-blur p-6 shadow-xl">
                <div className="mb-3 flex flex-wrap gap-4">
                  {categories.map((cat) => (
                    <span
                      key={cat}
                      onClick={() => setActive(cat)}
                      className={`text-base md:text-lg p-2 pb-3 opacity-80 cursor-pointer hover:opacity-100 hover:bg-gray-100 rounded
                        ${
                          active === cat
                            ? "border-b-2 border-black font-semibold"
                            : ""
                        }`}
                    >
                      {cat}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                  <input
                    className="col-span-2 p-3 border rounded-lg"
                    type="text"
                    placeholder="여행지나 숙소를 검색해보세요"
                  />
                  <input type="date" className="p-3 border rounded-lg" />
                  <select className="p-3 border rounded-lg">
                    <option>인원 선택</option>
                    <option>1명</option>
                    <option>2명</option>
                    <option>3명</option>
                    <option>4명</option>
                  </select>
                  <button className="rounded-lg bg-blue-500 text-white p-3 hover:bg-blue-600">
                    숙소 찾기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-15">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-12">
          <Event />
        </div>
      </section>

      <section className="pt-15">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-12">
          <Hot />
        </div>
      </section>
    </>
  );
}
