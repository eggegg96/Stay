import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PRICE_MIN, PRICE_MAX } from "@constants/filters";

export default function useFilterParams() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const [category, setCategory] = useState(params.get("category") || "");
  const [priceRange, setPriceRange] = useState([
    Number(params.get("minPrice")) || PRICE_MIN,
    Number(params.get("maxPrice")) || PRICE_MAX,
  ]);
  const [amenities, setAmenities] = useState(
    params.get("amenities")?.split(",").filter(Boolean) || []
  );

  // URL 업데이트
  useEffect(() => {
    const currentParams = new URLSearchParams(location.search);

    // 기존 검색 파라미터 보존
    const keyword = currentParams.get("keyword");
    const checkIn = currentParams.get("checkIn");
    const checkOut = currentParams.get("checkOut");
    const people = currentParams.get("people");
    const rooms = currentParams.get("rooms");

    const p = new URLSearchParams();

    // 검색 파라미터 먼저 추가
    if (keyword) p.set("keyword", keyword);
    if (checkIn) p.set("checkIn", checkIn);
    if (checkOut) p.set("checkOut", checkOut);
    if (people) p.set("people", people);
    if (rooms) p.set("rooms", rooms);

    // 필터 파라미터 추가
    if (category) p.set("category", category);

    const [minP, maxP] = priceRange;
    if (minP > PRICE_MIN) p.set("minPrice", String(minP));
    if (maxP < PRICE_MAX) p.set("maxPrice", String(maxP));

    if (amenities.length > 0) p.set("amenities", amenities.join(","));

    navigate(`?${p.toString()}`, { replace: true });
  }, [category, priceRange, amenities, navigate, location.search]);

  // 뒤로가기/앞으로가기 동기화
  useEffect(() => {
    const p = new URLSearchParams(location.search);
    setCategory(p.get("category") || "");
    setPriceRange([
      Number(p.get("minPrice")) || PRICE_MIN,
      Number(p.get("maxPrice")) || PRICE_MAX,
    ]);
    setAmenities(p.get("amenities")?.split(",").filter(Boolean) || []);
  }, [location.search]);

  return {
    category,
    setCategory,
    priceRange,
    setPriceRange,
    amenities,
    setAmenities,
  };
}
