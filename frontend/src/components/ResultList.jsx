import AccommodationCard from "./AccommodationCard";
import { ACCOMMODATIONS } from "../data/accommodations";
import { useLocation } from "react-router-dom";
import { CATEGORY_OPTIONS, PRICE_MIN, PRICE_MAX } from "../constants/filters";

export default function ResultList({ type, city, cityLabel }) {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const category = params.get("category") || "";
  const minPrice = Number(params.get("minPrice")) || PRICE_MIN;
  const maxPrice = Number(params.get("maxPrice")) || PRICE_MAX;
  const amenities = params.get("amenities")?.split(",").filter(Boolean) || [];

  // 필터 적용
  const results = ACCOMMODATIONS.filter((a) => {
    // 국내/해외 타입
    if (a.type !== type) return false;

    // 도시 필터
    const bySlug = a.citySlug === city; // 권장
    const byLabel = cityLabel && a.location?.includes?.(cityLabel);
    if (!(bySlug || byLabel)) return false;

    // 카테고리 필터
    if (category) {
      const catOpt = CATEGORY_OPTIONS.find((c) => c.value === category);
      if (!catOpt?.match?.includes(a.category)) return false;
    }

    // 가격 필터 (숙박 기준)
    const prices = a.rooms.map((r) => r.stay).filter(Boolean);
    const minRoomPrice = Math.min(...prices);
    const maxRoomPrice = Math.max(...prices);
    if (minRoomPrice > maxPrice || maxRoomPrice < minPrice) return false;

    // 시설 필터 (모든 선택된 시설을 포함해야 함)
    if (amenities.length > 0) {
      const hasAll = amenities.every((am) => a.amenities?.includes(am));
      if (!hasAll) return false;
    }

    return true;
  });

  if (results.length === 0) {
    return (
      <div className="mt-2 text-sm text-slate-500">
        “{cityLabel ?? city}”에 해당하는 숙소가 없습니다.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {results.map((item) => (
        <AccommodationCard
          key={item.id}
          id={item.id}
          type={item.type}
          name={item.name}
          location={item.location}
          desc={item.desc}
          images={item.images}
          rooms={item.rooms}
        />
      ))}
    </div>
  );
}
