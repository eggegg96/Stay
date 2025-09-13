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
      <div className="text-2xl font-bold">이벤트</div>

      <Swiper
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        spaceBetween={0}
        slidesPerView={3}
        justifyContent="center"
      >
        {EVENTS.map((event) => (
          <SwiperSlide key={event.id}>
            <div className="event m-5 justify-center items-center cursor-pointer hover:shadow-lg ">
              <img src={event.img} alt={event.name} />
              <h2>{event.name}</h2>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
