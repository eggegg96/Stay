import { useParams, useMatch, useSearchParams } from "react-router-dom";
import { useState, useRef } from "react";
import { HOTELS } from "../data/hotels";
import AmenityModal from "../components/AmenitiyModal";

export default function AccommodationDetailPage() {
  const { id } = useParams();
  const isDomestic = !!useMatch("/domestic/:id");
  const [params] = useSearchParams();

  const hotel = HOTELS.find(
    (h) =>
      h.id === id &&
      (isDomestic ? h.type === "domestic" : h.type === "overseas")
  );

  const [openAmenity, setOpenAmenity] = useState(false);
  const reviewRef = useRef(null);
  const locationRef = useRef(null);

  if (!hotel) return null;

  // 검색 조건 표시용
  const checkIn = params.get("checkIn") || "2025-10-14";
  const checkOut = params.get("checkOut") || "2025-10-15";
  const adults = params.get("adults") || 2;
  const rooms = params.get("rooms") || 1;

  // 공통 스크롤 함수
  const scrollTo = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    ref.current?.setAttribute("tabindex", "-1");
    ref.current?.focus({ preventScroll: true });
  };

  return (
    <section className="max-w-7xl mx-auto p-6">
      {/* 이미지 갤러리 */}
      <div className="mb-8 grid grid-cols-4 grid-rows-2 gap-1 w-full h-[520px]">
        <img
          src={hotel.images?.[0]}
          alt={hotel.name}
          className="col-span-2 row-span-2 h-full w-full object-cover rounded-l-2xl"
        />
        {[1, 2, 3, 4].map((idx, i) => {
          const corner =
            i === 1 ? "rounded-tr-2xl" : i === 3 ? "rounded-br-2xl" : "";
          return hotel.images?.[idx] ? (
            <img
              key={idx}
              src={hotel.images[idx]}
              alt={`${hotel.name} 이미지 ${idx + 1}`}
              className={`h-full w-full object-cover ${corner}`}
            />
          ) : null;
        })}
      </div>

      {/* 입력 정보 */}
      <div className="border-b border-slate-200 pb-4 mb-6">
        <h1 className="text-3xl font-bold">{hotel.name}</h1>
        <p className="text-gray-500">{hotel.location}</p>
        <p className="text-sm text-gray-400 mt-1">
          {checkIn} ~ {checkOut} · 성인 {adults}명 · 객실 {rooms}개
        </p>
      </div>

      {/* 숙소 설명 */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-2">숙소 정보</h2>
        <p className="text-gray-600">{hotel.desc}</p>
      </div>

      {/* 카드 3개 (부대시설, 리뷰, 위치) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* 1) 리뷰 섹션 이동 */}
        <a
          href="#review"
          onClick={(e) => {
            e.preventDefault();
            scrollTo(reviewRef);
          }}
          className="rounded-2xl border border-slate-200 p-4 hover:shadow transition"
        >
          <div className="font-semibold">평점 및 리뷰</div>
          <div className="mt-2 text-sm text-slate-500">
            {hotel.reviews?.length || 0}개 리뷰
          </div>
        </a>
        {/* 1) 부대시설 → 모달 열기 */}
        <button
          type="button"
          onClick={() => setOpenAmenity(true)}
          className="rounded-2xl border border-slate-200 p-4 text-left hover:shadow transition cursor-pointer"
        >
          <div className="font-semibold">서비스 및 부대시설</div>
          <div className="mt-2 text-sm text-slate-500">
            스파 무선인터넷 주차장 등
          </div>
        </button>
        {/* 3) 위치 섹션 이동 */}
        <a
          href="#location"
          onClick={(e) => {
            e.preventDefault();
            scrollTo(locationRef);
          }}
          className="rounded-2xl border border-slate-200 p-4 hover:shadow transition"
        >
          <div className="font-semibold">위치 정보</div>
          <div className="mt-2 text-sm text-slate-500">{hotel.location}</div>
        </a>
      </div>

      {/* 모달 */}
      <AmenityModal
        open={openAmenity}
        onClose={() => setOpenAmenity(false)}
        items={hotel.amenities}
      />

      {/* 리뷰 섹션 */}
      <section id="review" ref={reviewRef} className="mt-12 outline-none">
        <h2 className="text-xl font-bold mb-4">리뷰</h2>
        <div className="h-40 bg-slate-50 rounded-lg flex items-center justify-center text-slate-200">
          리뷰 내용 영역
        </div>
      </section>

      {/* 객실 타입 */}
      <div className="space-y-6 mt-12">
        <h2 className="text-xl font-bold">객실 선택</h2>
        {hotel.rooms.map((room, idx) => (
          <div
            key={idx}
            className="border border-slate-300 rounded-lg p-4 shadow-sm hover:shadow-md transition"
          >
            <h3 className="text-lg font-semibold">{room.name}</h3>
            <div className="mt-3 flex justify-between items-center">
              <span className="text-gray-600">
                대실 {room.dayUse.toLocaleString()}원
              </span>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">
                예약
              </button>
            </div>
            <div className="mt-2 flex justify-between items-center">
              <span className="text-gray-600">
                숙박 {room.stay.toLocaleString()}원
              </span>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">
                예약
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* 위치 섹션 */}
      <section id="location" ref={locationRef} className="mt-12 outline-none">
        <h2 className="text-xl font-bold mb-4">위치 정보</h2>
        <div className="h-56 bg-slate-50 rounded-lg flex items-center justify-center text-slate-200">
          지도 표시 영역
        </div>
      </section>
    </section>
  );
}
