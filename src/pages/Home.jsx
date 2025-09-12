import { useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Hot from "../components/HotAccommodation";

export default function Home() {
  const categories = [
    "모텔",
    "호텔",
    "게스트하우스",
    "호스텔",
    "펜션",
    "리조트",
    "풀빌라",
    "캠핑장",
  ];

  const [active, setActive] = useState("모텔"); // 기본 선택값

  return (
    <section className=" bg-slate-100">
      <section className="w-full px-4 sm:px-6 lg:px-12 pt-10 sm:pt-15 lg:pt-20 pb-8 sm:pb-12 lg:pb-16">
        <div className="max-w-6xl w-full mx-auto ">
          <div className="text-2xl font-bold text-center">
            전주 한옥부터 서울 호텔까지, 여행할 땐 Stay
          </div>

          <div className="flex-col flex-wrap justify-center mt-6 border rounded-xl p-6 border-slate-200 bg-white shadow-md">
            <div className="flex flex-wrap justify-center mb-2">
              {categories.map((cat) => (
                <span
                  key={cat}
                  onClick={() => setActive(cat)}
                  className={`text-2xl p-2 cursor-pointer opacity-70 hover:bg-gray-100
              ${active === cat ? "border-b-2 border-black font-semibold" : ""}`}
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
      </section>
      <Hot />
    </section>
  );
}
