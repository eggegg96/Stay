import { useParams } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { ACCOMMODATIONS } from "@data/accommodations";
import { useHeader } from "@contexts/HeaderContext";
import { formatRangeKR, nightsBetween } from "@/utils/dateText";
import { useAccommodationParams } from "@hooks/useAccommodationParams";

import AmenityModal from "@accommodation/AmenitiyModal";
import MapContainer from "@common/MapContainer";

function formatKRW(n) {
  return typeof n === "number" ? n.toLocaleString() : null;
}

export default function AccommodationDetailPage() {
  const { id } = useParams();
  const { setHeader, resetHeader } = useHeader();

  // 커스텀 훅으로 파라미터 관리
  const {
    checkIn,
    checkOut,
    people,
    children,
    childrenAges,
    rooms,
    isOverseas,
    isDomestic,
  } = useAccommodationParams();

  // 숙소 정보 찾기
  const accommodation = ACCOMMODATIONS.find(
    (h) =>
      String(h.id) === String(id) &&
      (isDomestic ? h.type === "domestic" : h.type === "overseas")
  );

  const [openAmenity, setOpenAmenity] = useState(false);
  const reviewRef = useRef(null);
  const locationRef = useRef(null);

  if (!accommodation) return null;

  // 날짜 관련 계산
  const startDate = new Date(checkIn);
  const endDate = new Date(checkOut);
  const nights = nightsBetween(startDate, endDate);

  // 가격 계산 (숙박일수 + 인원 기준)
  const calculatePrice = (basePrice) => {
    if (!basePrice) return null;
    return basePrice * nights * Number(people);
  };

  // HeaderContext 업데이트
  useEffect(() => {
    const dateText = formatRangeKR(startDate, endDate, nights);

    setHeader({
      mode: "detail",
      keyword: accommodation.name,
      checkIn,
      checkOut,
      people,
      children,
      childrenAges,
      rooms,
      dateText,
    });

    return () => {
      if (
        !location.pathname.includes("/domestic/") &&
        !location.pathname.includes("/overseas/")
      ) {
        resetHeader();
      }
    };
  }, [accommodation.name, checkIn, checkOut, people, children, rooms, nights]);

  // URL 파라미터 변경 감지 (브라우저 뒤로가기/앞으로가기)
  useEffect(() => {
    const handlePopState = () => {
      const newParams = new URLSearchParams(window.location.search);
      const newCheckIn = newParams.get("checkIn") || checkIn;
      const newCheckOut = newParams.get("checkOut") || checkOut;
      const newPeople = Number(newParams.get("people") || people);
      const newRooms = Number(newParams.get("rooms") || rooms);

      // 아동 정보 파싱
      const newChildrenParam = newParams.get("children");
      let newChildren = 0;
      let newChildrenAges = [];

      if (newChildrenParam && isOverseas) {
        newChildrenAges = newChildrenParam.split(",").filter(Boolean);
        newChildren = newChildrenAges.length;
      }

      setHeader({
        mode: "detail",
        keyword: accommodation.name,
        checkIn: newCheckIn,
        checkOut: newCheckOut,
        people: newPeople,
        children: newChildren,
        childrenAges: newChildrenAges,
        rooms: newRooms,
        dateText: formatRangeKR(new Date(newCheckIn), new Date(newCheckOut)),
      });
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [
    accommodation.name,
    checkIn,
    checkOut,
    people,
    children,
    childrenAges,
    rooms,
    isOverseas,
    setHeader,
  ]);

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
          src={accommodation.images?.[0]}
          alt={accommodation.name}
          className="col-span-2 row-span-2 h-full w-full object-cover rounded-l-2xl"
        />
        {[1, 2, 3, 4].map((idx, i) => {
          const corner =
            i === 1 ? "rounded-tr-2xl" : i === 3 ? "rounded-br-2xl" : "";
          return accommodation.images?.[idx] ? (
            <img
              key={idx}
              src={accommodation.images[idx]}
              alt={`${accommodation.name} 이미지 ${idx + 1}`}
              className={`h-full w-full object-cover ${corner}`}
            />
          ) : null;
        })}
      </div>

      {/* 숙소 설명 */}
      <div className="mb-8">
        <p className="text-gray-600">{accommodation.desc}</p>
        <h2 className="text-2xl font-bold mb-2">{accommodation.name}</h2>
      </div>

      {/* 카드 3개 (부대시설, 리뷰, 위치) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* 리뷰 섹션 이동 */}

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
            {accommodation.reviews?.length || 0}개 리뷰
          </div>
        </a>

        {/* 부대시설 → 모달 열기 */}
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

        {/* 위치 섹션 이동 */}

        <a
          href="#location"
          onClick={(e) => {
            e.preventDefault();
            scrollTo(locationRef);
          }}
          className="rounded-2xl border border-slate-200 p-4 hover:shadow transition"
        >
          <div className="font-semibold">위치 정보</div>
          <div className="mt-2 text-sm text-slate-500">
            {accommodation.location}
          </div>
        </a>
      </div>

      {/* 모달 */}
      <AmenityModal
        open={openAmenity}
        onClose={() => setOpenAmenity(false)}
        items={accommodation.amenities}
      />

      {/* 객실 타입 */}
      <div className="space-y-6 mt-12">
        <h2 className="text-xl font-bold">객실 선택</h2>
        {accommodation.rooms.map((room, idx) => {
          const dayPrice = calculatePrice(room?.dayUse);
          const stayPrice = calculatePrice(room?.stay);
          const dayFormatted = formatKRW(dayPrice);
          const stayFormatted = formatKRW(stayPrice);

          return (
            <div
              key={idx}
              className="border border-slate-300 rounded-lg p-4 shadow-sm hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold">{room.name}</h3>
              <div className="text-xs text-gray-500 mt-1">
                {nights}박 기준 • 성인 {people}명
                {isOverseas && children > 0 && ` • 아동 ${children}명`}
              </div>

              {/* 대실 (해외 숙소는 제외) */}
              {accommodation.type === "domestic" && room.dayUse && (
                <div className="mt-3 flex justify-between items-center">
                  <div>
                    <span className="text-gray-600">
                      대실 {dayFormatted ? `${dayFormatted}원` : "정보 없음"}
                    </span>
                    <div className="text-xs text-gray-400">
                      기본 {formatKRW(room.dayUse)}원 × {nights}박 × {people}명
                    </div>
                  </div>
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">
                    예약
                  </button>
                </div>
              )}

              {/* 숙박 */}
              {room.stay && (
                <div className="mt-3 flex justify-between items-center">
                  <div>
                    <span className="text-gray-600">
                      숙박 {stayFormatted ? `${stayFormatted}원` : "정보 없음"}
                    </span>
                    <div className="text-xs text-gray-400">
                      기본 {formatKRW(room.stay)}원 × {nights}박 ×{" "}
                      {people + children}명
                    </div>
                  </div>
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">
                    예약
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 리뷰 섹션 */}
      <section id="review" ref={reviewRef} className="mt-12 outline-none">
        <h2 className="text-xl font-bold mb-4">리뷰</h2>
        <div className="h-40 bg-slate-50 rounded-lg flex items-center justify-center text-slate-200">
          리뷰 내용 영역
        </div>
      </section>

      {/* 위치 섹션 */}
      <section id="location" ref={locationRef} className="mt-12 outline-none">
        <h2 className="text-xl font-bold mb-4">위치 정보</h2>
        <MapContainer
          accommodation={accommodation}
          query={accommodation.name}
          lat={accommodation.lat}
          lng={accommodation.lng}
          className="w-full h-[420px] rounded-lg border"
        />
        <p className="text-sm text-gray-600 mt-2">{accommodation.location}</p>
      </section>
    </section>
  );
}
