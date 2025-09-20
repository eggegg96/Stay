// src/components/ResultList.jsx
import AccommodationCard from "./AccommodationCard";
import { ACCOMMODATIONS } from "../data/accommodations";

export default function ResultList({ type, city, cityLabel }) {
  // type: "domestic" | "overseas"
  // city: "seoul" 같은 슬러그가 들어옴 (DomesticResultsPage에서 citySlug 전달)

  // 안전 필터: type, citySlug 우선. location에 도시명 포함 매칭은 보조로만.
  const results = ACCOMMODATIONS.filter((a) => {
    if (a.type !== type) return false;

    const bySlug = a.citySlug === city; // 권장
    const byLabel = cityLabel && a.location?.includes?.(cityLabel);
    return bySlug || byLabel; // 슬러그 매칭이 우선, 보조로 라벨 포함 허용
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
