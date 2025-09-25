import { useSearchParams, useMatch } from "react-router-dom";
import { useHeader } from "@contexts/HeaderContext";

export function useAccommodationParams() {
  const [params] = useSearchParams();
  const isDomestic = !!useMatch("/domestic/:id");
  const isOverseas = !isDomestic;
  const { header } = useHeader();

  // 기본 파라미터
  const checkIn = params.get("checkIn") || header.checkIn || "2025-10-14";
  const checkOut = params.get("checkOut") || header.checkOut || "2025-10-15";
  const people = Number(params.get("people") || header.people || 2);
  const rooms = Number(params.get("rooms") || header.rooms || 1);

  // 아동 정보 파싱
  const childrenParam = params.get("children");
  let children = 0;
  let childrenAges = [];

  if (childrenParam && isOverseas) {
    childrenAges = childrenParam.split(",").filter(Boolean);
    children = childrenAges.length;
  }

  return {
    checkIn,
    checkOut,
    people,
    children,
    childrenAges,
    rooms,
    isOverseas,
    isDomestic,
  };
}
