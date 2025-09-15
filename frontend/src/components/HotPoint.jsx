import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

const DOMESTIC_PLACES = [
  { id: 1, name: "제주도", img: "/images/jeju.jpg" },
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
  return (
    <section className=" bg-white">
      <div className="text-2xl font-bold">국내 인기 여행지</div>
      <div className="relative py-5">
        {/* 화살표 버튼은 Swiper 기본 버튼 사용 */}
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
          {DOMESTIC_PLACES.map((p) => (
            <SwiperSlide key={p.id}>
              <a
                href="#"
                className="group block overflow-hidden rounded-2xl shadow-sm ring-1 ring-slate-200 bg-white"
              >
                <div className="relative aspect-[4/3]">
                  <img
                    src={p.img}
                    alt={p.name}
                    className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 p-3">
                    <div className="inline-flex rounded-lg bg-white/90 px-3 py-1 text-sm font-semibold">
                      {p.name}
                    </div>
                  </div>
                </div>
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
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
          className="!py-2"
        >
          {OVERSEAS_PLACES.map((p) => (
            <SwiperSlide key={p.id}>
              <a
                href="#"
                className="group block overflow-hidden rounded-2xl shadow-sm ring-1 ring-slate-200 bg-white"
              >
                <div className="relative aspect-[4/3]">
                  <img
                    src={p.img}
                    alt={p.name}
                    className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                  />
                  {/* 라벨 영역 */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 p-3">
                    <div className="inline-flex rounded-lg bg-white/90 px-3 py-1 text-sm font-semibold">
                      {p.name}
                    </div>
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
