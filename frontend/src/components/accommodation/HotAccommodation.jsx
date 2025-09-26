import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Grid } from "swiper/modules";
import { ACCOMMODATIONS } from "@data/accommodations";

const TABS = [
  { id: 0, name: "호텔·리조트", filter: "호텔·리조트" },
  { id: 1, name: "펜션·풀빌라", filter: "펜션·풀빌라" },
  { id: 2, name: "프리미엄 블랙", filter: "premium" }, // 특별 필터
  { id: 3, name: "캠핑·글램핑", filter: "캠핑" },
  { id: 4, name: "홈&빌라", filter: "홈&빌라" },
  { id: 5, name: "게하·호스텔", filter: "게하·호스텔" },
  { id: 6, name: "스파·워터파크", filter: "spa" }, // 특별 필터
  { id: 7, name: "기타 숙소", filter: "모텔" },
];

export default function Hot() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [clickedAccommodation, setClickedAccommodation] = useState(null);

  // 탭에 따라 숙소 필터링
  const filtered = useMemo(() => {
    const currentFilter = TABS[activeTab].filter;

    if (currentFilter === "premium") {
      // 프리미엄: 가격이 높은 고급 숙소들
      return ACCOMMODATIONS.filter((acc) =>
        acc.rooms.some((room) => room.stay >= 200000)
      ).slice(0, 8);
    }

    if (currentFilter === "spa") {
      // 스파: 스파 관련 어메니티가 있는 숙소들
      return ACCOMMODATIONS.filter((acc) =>
        acc.amenities.some(
          (amenity) =>
            amenity.includes("스파") ||
            amenity.includes("월풀") ||
            amenity.includes("수영장")
        )
      ).slice(0, 8);
    }

    // 일반 카테고리 필터링
    return ACCOMMODATIONS.filter((acc) => acc.category === currentFilter).slice(
      0,
      8
    );
  }, [activeTab]);

  // 숙소 클릭 핸들러
  const handleAccommodationClick = (accommodation) => {
    const uniqueKey = `accommodation-${accommodation.id}`;
    setClickedAccommodation(uniqueKey);

    // 기본 검색 파라미터 설정 (상세페이지에서 필요)
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const checkIn = today.toISOString().split("T")[0];
    const checkOut = tomorrow.toISOString().split("T")[0];
    const people = "2";
    const rooms = "1";

    // 약간의 딜레이 후 올바른 경로로 이동
    setTimeout(() => {
      navigate(
        `/${accommodation.type}/${accommodation.id}?checkIn=${checkIn}&checkOut=${checkOut}&people=${people}&rooms=${rooms}`
      );
      setClickedAccommodation(null);

      // 페이지 이동 후 스크롤 상단으로 이동
      setTimeout(() => {
        window.scrollTo({ top: 0 });
      }, 100);
    }, 150);
  };

  // 키보드 네비게이션
  const onKeyDown = (e, idx) => {
    if (e.key === "ArrowRight") setActiveTab((idx + 1) % TABS.length);
    if (e.key === "ArrowLeft")
      setActiveTab((idx - 1 + TABS.length) % TABS.length);
    if (e.key === "Enter" || e.key === " ") setActiveTab(idx);
  };

  // 최저 가격 찾기 함수
  const getMinPrice = (accommodation) => {
    const prices = accommodation.rooms.map((room) => room.stay).filter(Boolean);
    return Math.min(...prices);
  };

  // 리뷰 점수 추출 (desc에서)
  const getReviewScore = (desc) => {
    const match = desc.match(/평점\s*(\d+\.?\d*)/);
    return match ? parseFloat(match[1]) : null;
  };

  return (
    <section className="bg-white relative">
      {/* 전체 화면 로딩 오버레이 */}
      {clickedAccommodation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
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
                "my-1 cursor-pointer rounded-full px-4 py-2 text-sm whitespace-nowrap transition-all duration-200",
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
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">선택하신 카테고리의 숙소가 없습니다.</p>
            <p className="text-sm mt-2">다른 카테고리를 선택해보세요.</p>
          </div>
        ) : (
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
            key={`${activeTab}-${filtered.length}`} // 리렌더링 강제
          >
            {filtered.map((accommodation) => {
              const uniqueKey = `accommodation-${accommodation.id}`;
              const isLoading = clickedAccommodation === uniqueKey;
              const minPrice = getMinPrice(accommodation);
              const reviewScore = getReviewScore(accommodation.desc);

              return (
                <SwiperSlide key={accommodation.id}>
                  <button
                    onClick={() => handleAccommodationClick(accommodation)}
                    disabled={clickedAccommodation !== null}
                    className={`mb-2 group block w-full overflow-hidden rounded-2xl shadow bg-white transition-all duration-200
                      ${isLoading ? "scale-95 ring-2 ring-blue-400" : ""}`}
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-slate-100 relative cursor-pointer">
                      <img
                        src={accommodation.images[0]}
                        alt={accommodation.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                      />
                    </div>
                    <div className="p-3 text-left">
                      <div className="truncate text-base font-semibold text-gray-900 m  ">
                        {accommodation.name}
                      </div>
                      <div className="text-sm text-gray-600 line-clamp-1">
                        {accommodation.location}
                      </div>
                      {/* 리뷰 점수 배지 */}
                      {reviewScore && (
                        <div>
                          <div className="inline-flex items-center gap-1 rounded-lg bg-white/90 text-xs font-semibold backdrop-blur-sm">
                            <span className="text-yellow-500">★</span>
                            <span>{reviewScore}</span>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="text-lg font-bold text-black">
                          {" "}
                          {minPrice.toLocaleString()}원
                          <span className="text-sm text-gray-500 font-normal ml-1">
                            ~
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {accommodation.category}
                        </div>
                      </div>
                    </div>
                  </button>
                </SwiperSlide>
              );
            })}
          </Swiper>
        )}
      </div>
    </section>
  );
}
