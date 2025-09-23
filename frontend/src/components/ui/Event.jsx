import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

const EVENTS = [
  { id: 1, name: "봄맞이 할인 이벤트", img: "/images/event1.jpg" },
  { id: 2, name: "여름 휴가 프로모션", img: "/images/event2.jpg" },
  { id: 3, name: "가을 단풍 여행", img: "/images/event3.jpg" },
  { id: 4, name: "겨울 스키 패키지", img: "/images/event4.jpg" },
];

export default function Event() {
  return (
    <section className="bg-white">
      <div className=" flex items-center justify-between">
        <span className="text-2xl font-bold">이벤트</span>
        <span className="text-blue-500 cursor-pointer">더보기</span>
      </div>

      <Swiper
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        spaceBetween={0}
        slidesPerView={3}
        justifyContent="center"
        className="my-swiper"
      >
        {EVENTS.map((event) => (
          <SwiperSlide key={event.id}>
            <div className="event justify-center items-center cursor-pointer hover:shadow-l rounded-lg p-5">
              <img src={event.img} alt={event.name} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
