import AccommodationCard from "./AccommodationCard";
import { ACCOMMODATIONS } from "../data/accommodations";
import { useLocation } from "react-router-dom"; // Link 제거
import { CATEGORY_OPTIONS, PRICE_MIN, PRICE_MAX } from "../constants/filters";

export default function ResultList({ type, keywordSlug, keyword }) {
  // city, cityLabel → keywordSlug, keyword
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const { search } = location; // ✅ 상세로 이동할 때 그대로 넘김

  const category = params.get("category") || "";
  const minPrice = Number(params.get("minPrice")) || PRICE_MIN;
  const maxPrice = Number(params.get("maxPrice")) || PRICE_MAX;
  const amenities = params.get("amenities")?.split(",").filter(Boolean) || [];

  // 필터 적용
  const results = ACCOMMODATIONS.filter((a) => {
    // 국내/해외 타입
    if (a.type !== type) return false;

    // 디버깅용: 첫 번째 숙소만 로그 출력
    if (a.id === ACCOMMODATIONS[0].id) {
      console.log("필터 테스트:", {
        name: a.name,
        citySlug: a.citySlug,
        searchKeywordSlug: keywordSlug,
        bySlug: a.citySlug === keywordSlug,
        byName: keyword && a.name?.includes?.(keyword),
      });
    }
    // console.log("ResultList 검색:", { keyword, keywordSlug, type });

    // 키워드 필터 (도시명 또는 숙소명 검색)
    const keywordLower = keyword?.toLowerCase() || "";
    const keywordParts = keywordLower.split(" ").filter(Boolean);

    const bySlug = a.citySlug === keywordSlug; // 도시 코드로 매칭
    const byKeyword = keywordParts.some((part) =>
      a.location?.toLowerCase().includes(part)
    ); // 주소에서 키워드 부분 검색
    const byName = keywordParts.some((part) =>
      a.name?.toLowerCase().includes(part)
    ); // 숙소명에서 키워드 부분 검색

    // 정확한 숙소명 매칭도 추가
    const exactNameMatch =
      keyword && a.name?.toLowerCase() === keyword.toLowerCase();

    if (!(bySlug || byKeyword || byName || exactNameMatch)) return false;

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
        "{keyword ?? keywordSlug}"에 해당하는 숙소가 없습니다.
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
          search={search}
        />
      ))}
    </div>
  );
}
