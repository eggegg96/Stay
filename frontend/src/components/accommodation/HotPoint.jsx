import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

const DOMESTIC_PLACES = [
  { id: 1, name: "제주", img: "/images/jeju.jpg" },
  { id: 2, name: "서울", img: "/images/seoul.jpg" },
  { id: 3, name: "부산", img: "/images/busan.jpg" },
  { id: 4, name: "강릉", img: "/images/gangneung.jpg" },
  { id: 5, name: "인천", img: "/images/incheon.jpg" },
  { id: 6, name: "경주", img: "/images/gyeongju.jpg" },
];

const OVERSEAS_PLACES = [
  { id: 1, name: "오사카", img: "/images/osaka.jpg" },
  { id: 2, name: "도쿄", img: "/images/tokyo.jpg" },
  { id: 3, name: "나트랑", img: "/images/nhatrang.jpg" },
  { id: 4, name: "후쿠오카", img: "/images/fukuoka.jpg" },
  { id: 5, name: "다낭", img: "/images/danang.jpg" },
  { id: 6, name: "괌", img: "/images/guam.jpg" },
];

export default function HotPoint() {
  const navigate = useNavigate();
  const [clickedPlace, setClickedPlace] = useState(null);

  // 여행지 클릭 핸들러
  const handlePlaceClick = (place, isOverseas = false) => {
    // 고유 키로 클릭 상태 관리 (국내/해외 + ID 조합)
    const uniqueKey = `${isOverseas ? "overseas" : "domestic"}-${place.id}`;
    setClickedPlace(uniqueKey);

    // 기본 검색 파라미터 설정
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const params = new URLSearchParams({
      keyword: place.name,
      checkIn: today.toISOString().split("T")[0],
      checkOut: tomorrow.toISOString().split("T")[0],
      adults: "2",
      rooms: "1",
    });

    // 국내/해외 구분해서 라우팅
    const basePath = isOverseas ? "overseas" : "domestic";

    // 약간의 딜레이로 클릭 피드백 보여주고 이동
    setTimeout(() => {
      navigate(`/${basePath}?${params.toString()}`);
      setClickedPlace(null);

      // 페이지 이동 후 스크롤 상단으로 이동
      setTimeout(() => {
        window.scrollTo({ top: 0 });
      }, 100);
    }, 150);
  };

  // 공통 슬라이드 렌더링 함수
  const renderPlaceSlide = (place, isOverseas = false) => {
    const uniqueKey = `${isOverseas ? "overseas" : "domestic"}-${place.id}`;
    const isLoading = clickedPlace === uniqueKey;

    return (
      <SwiperSlide key={place.id}>
        <button
          onClick={() => handlePlaceClick(place, isOverseas)}
          disabled={clickedPlace !== null} // 로딩 중일 때 다른 버튼 비활성화
          className={`group block w-full overflow-hidden rounded-2xl shadow-sm ring-1 ring-slate-200 bg-white transition-all duration-200 ${
            clickedPlace !== null
              ? "opacity-50 cursor-not-allowed"
              : "hover:ring-2 hover:ring-slate-300"
          } ${isLoading ? "scale-95 ring-2 ring-blue-400" : ""}`}
        >
          <div className="relative aspect-[4/3] cursor-pointer">
            <img
              src={place.img}
              alt={place.name}
              className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
            />
            <div className="pointer-events-none absolute bottom-3 left-3">
              <div className="inline-flex rounded-lg bg-white/60 px-3 py-1 text-sm font-semibold group-hover:bg-white/80 transition-all duration-200 backdrop-blur-md">
                {place.name}
              </div>
            </div>
          </div>
        </button>
      </SwiperSlide>
    );
  };

  return (
    <section className="bg-white relative">
      {/* 화면 로딩 오버레이 */}
      {clickedPlace && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* 국내 인기 여행지 */}
      <div className="text-2xl font-bold">국내 인기 여행지</div>
      <div className="relative py-5">
        <Swiper
          modules={[Navigation]}
          navigation
          spaceBetween={16}
          slidesPerView={2}
          breakpoints={{
            640: { slidesPerView: 3, spaceBetween: 16 },
            1024: { slidesPerView: 4, spaceBetween: 20 },
            1280: { slidesPerView: 5, spaceBetween: 24 },
          }}
          className="!py-2 my-swiper"
        >
          {DOMESTIC_PLACES.map((place) => renderPlaceSlide(place, false))}
        </Swiper>
      </div>

      {/* 해외 인기 여행지 */}
      <div className="text-2xl font-bold">해외 인기 여행지</div>
      <div className="relative py-5">
        <Swiper
          modules={[Navigation]}
          navigation
          spaceBetween={16}
          slidesPerView={2}
          breakpoints={{
            640: { slidesPerView: 3, spaceBetween: 16 },
            1024: { slidesPerView: 4, spaceBetween: 20 },
            1280: { slidesPerView: 5, spaceBetween: 24 },
          }}
          className="!py-2 my-swiper"
        >
          {OVERSEAS_PLACES.map((place) => renderPlaceSlide(place, true))}
        </Swiper>
      </div>
    </section>
  );
}
