import { useState, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Grid } from "swiper/modules";

const HOTELS = [
  { id: 1, name: "제주 바다뷰 호텔", img: "/images/h1.jpg" },
  { id: 2, name: "부산 하버 스테이", img: "/images/h2.jpg" },
  { id: 3, name: "서울 시티 라운지", img: "/images/h3.jpg" },
  { id: 4, name: "여수 오션 리조트", img: "/images/h4.jpg" },
  { id: 5, name: "서울 신라 호텔", img: "/images/h5.jpg" },
  { id: 6, name: "Hayatt", img: "/images/h6.jpg" },
  { id: 7, name: "인터컨티넨탈 서울", img: "/images/h7.jpg" },
  { id: 8, name: "임페리얼 펠리스", img: "/images/h8.jpg" },
  { id: 9, name: "조선호텔", img: "/images/h9.jpg" },
  { id: 10, name: "삼청각", img: "/images/h10.jpg" },
];

const TABS = [
  { id: 0, name: "호텔·리조트" },
  { id: 1, name: "펜션·풀빌라" },
  { id: 2, name: "프리미엄 블랙" },
  { id: 3, name: "캠핑·글램핑" },
  { id: 4, name: "홈&빌라" },
  { id: 5, name: "게하·호스텔" },
  { id: 6, name: "스파·워터파크" },
  { id: 7, name: "기타 숙소" },
];

export default function Hot() {
  const [activeTab, setActiveTab] = useState(0);

  // 지금은 필터 없이 전체 사용
  // 카테고리별 필터가 필요하면 HOTELS에 type 등 필드를 추가해서 여기서 분기
  const filtered = useMemo(() => HOTELS, []);

  const onKeyDown = (e, idx) => {
    if (e.key === "ArrowRight") setActiveTab((idx + 1) % TABS.length);
    if (e.key === "ArrowLeft")
      setActiveTab((idx - 1 + TABS.length) % TABS.length);
    if (e.key === "Enter" || e.key === " ") setActiveTab(idx);
  };

  return (
    <section className="bg-white">
      <div className="text-2xl font-bold">인기 숙소</div>

      {/* 탭 리스트 */}
      <ul
        role="tablist"
        aria-label="인기 추천 숙소"
        className="mt-3 flex gap-2 overflow-x-auto"
      >
        {TABS.map((tab, idx) => {
          const selected = activeTab === idx;
          return (
            <li
              key={tab.id}
              id={`POPULAR_ACCOMMODATION_TAB_${tab.id}`}
              role="tab"
              aria-selected={selected}
              aria-controls={`panel_${tab.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActiveTab(idx)}
              onKeyDown={(e) => onKeyDown(e, idx)}
              className={[
                "my-1 cursor-pointer rounded-full px-4 py-2 text-sm whitespace-nowrap",
                selected
                  ? "bg-slate-900 text-white"
                  : "border-1 text-black-700 hover:bg-slate-200",
              ].join(" ")}
            >
              {tab.name}
            </li>
          );
        })}
      </ul>
      <div
        id={`panel_${TABS[activeTab].id}`}
        role="tabpanel"
        aria-labelledby={`POPULAR_ACCOMMODATION_TAB_${TABS[activeTab].id}`}
        className="mt-4"
      >
        <Swiper
          modules={[Navigation, Grid]}
          className="mt-2"
          spaceBetween={16}
          slidesPerView={4}
          grid={{ rows: 2, fill: "row" }}
          breakpoints={{
            0: { slidesPerView: 2, grid: { rows: 2, fill: "row" } },
            1024: { slidesPerView: 3, grid: { rows: 2, fill: "row" } },
            1280: { slidesPerView: 4, grid: { rows: 2, fill: "row" } },
          }}
          navigation
          key={activeTab}
        >
          {filtered.map((hotel) => (
            <SwiperSlide key={hotel.id} className="cursor-pointer">
              <a className="block overflow-hidden rounded-2xl shadow bg-white">
                <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                  <img
                    src={hotel.img}
                    alt={hotel.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-300 ease-out hover:scale-[1.03]"
                  />
                </div>
                <div className="p-3">
                  <div className="truncate text-base font-semibold">
                    {hotel.name}
                  </div>
                </div>
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
