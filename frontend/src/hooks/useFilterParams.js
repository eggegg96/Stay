import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PRICE_MIN, PRICE_MAX } from "../constants/filters";

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
    const p = new URLSearchParams();

    if (category) p.set("category", category);

    const [minP, maxP] = priceRange;
    if (minP > PRICE_MIN) p.set("minPrice", String(minP));
    if (maxP < PRICE_MAX) p.set("maxPrice", String(maxP));

    if (amenities.length > 0) p.set("amenities", amenities.join(","));

    navigate(`?${p.toString()}`, { replace: true });
  }, [category, priceRange, amenities, navigate]);

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
