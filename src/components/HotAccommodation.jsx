import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

const HOTELS = [
  { id: 1, name: "제주 바다뷰 호텔", img: "/images/h1.jpg" },
  { id: 2, name: "부산 하버 스테이", img: "/images/h2.jpg" },
  { id: 3, name: "서울 시티 라운지", img: "/images/h3.jpg" },
  { id: 4, name: "여수 오션 리조트", img: "/images/h4.jpg" },
  { id: 5, name: "서울 신라 호텔", img: "/images/h5.jpg" },
  { id: 6, name: "Hayatt", img: "/images/h6.jpg" },
  { id: 7, name: "인터컨티넨탈 서울", img: "/images/h7.jpg" },
];

export default function Hot() {
  return (
    <section className="bg-white">
      <div className="text-2xl font-bold">인기 숙소</div>

      <Swiper
        modules={[Navigation]}
        className="mt-4"
        spaceBetween={16}
        slidesPerView={1.1}
        breakpoints={{
          640: { slidesPerView: 2.1 },
          1024: { slidesPerView: 3.1 },
          1280: { slidesPerView: 4 },
        }}
        navigation
      >
        {HOTELS.map((hotel) => (
          <SwiperSlide key={hotel.id}>
            <a className="block overflow-hidden rounded-2xl border bg-white">
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
    </section>
  );
}
