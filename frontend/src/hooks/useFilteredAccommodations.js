import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { ACCOMMODATIONS } from "@data/accommodations";
import { CATEGORY_OPTIONS, PRICE_MIN, PRICE_MAX } from "@constants/filters";
import { filterAccommodationsByKeyword } from "@utils/searchUtils";

export default function useFilteredAccommodations(type, keyword, keywordSlug) {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  // 필터 파라미터 추출
  const category = params.get("category") || "";
  const minPrice = Number(params.get("minPrice")) || PRICE_MIN;
  const maxPrice = Number(params.get("maxPrice")) || PRICE_MAX;
  const amenities = params.get("amenities")?.split(",").filter(Boolean) || [];

  // 필터링된 결과 계산 (useMemo로 최적화)
  const filteredAccommodations = useMemo(() => {
    // 1. 키워드로 기본 필터링
    const keywordFilteredResults = filterAccommodationsByKeyword(
      ACCOMMODATIONS,
      keyword,
      keywordSlug,
      type
    );

    // 2. 추가 필터 적용
    return keywordFilteredResults.filter((a) => {
      // 카테고리 필터
      if (category) {
        const catOpt = CATEGORY_OPTIONS.find((c) => c.value === category);
        if (!catOpt?.match?.includes(a.category)) return false;
      }

      // 가격 필터
      const prices = a.rooms.map((r) => r.stay).filter(Boolean);
      if (prices.length > 0) {
        const minRoomPrice = Math.min(...prices);
        const maxRoomPrice = Math.max(...prices);
        if (minRoomPrice > maxPrice || maxRoomPrice < minPrice) return false;
      }

      // 시설 필터
      if (amenities.length > 0) {
        const hasAll = amenities.every((am) => a.amenities?.includes(am));
        if (!hasAll) return false;
      }

      return true;
    });
  }, [type, keyword, keywordSlug, category, minPrice, maxPrice, amenities]);

  return {
    filteredAccommodations,
    totalCount: filteredAccommodations.length,
    filters: { category, minPrice, maxPrice, amenities },
  };
}
