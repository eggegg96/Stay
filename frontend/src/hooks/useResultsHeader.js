import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useHeader } from "../contexts/HeaderContext";
import { formatRangeKR, nightsBetween } from "../utils/dateText";

function toSlug(s = "") {
  return String(s)
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase()
    .replace(/\s/g, "-");
}

/**
 * @param {"domestic"|"overseas"} type   결과 페이지 타입
 * @param {string} locationLabel         헤더 서브라인 (예: "국내 숙소", "해외 숙소")
 */
export default function useResultsHeader(type, locationLabel) {
  const [params] = useSearchParams();
  const { setHeader, resetHeader } = useHeader();

  // URL 파라미터
  const city = params.get("city") || (type === "overseas" ? "도쿄" : "서울");
  const checkIn = params.get("checkIn") || "2025-10-14";
  const checkOut = params.get("checkOut") || "2025-10-15";
  const people = Number(params.get("people") || params.get("adults") || 2);
  const rooms = Number(params.get("rooms") || 1);

  // 파생값
  const start = useMemo(() => new Date(checkIn), [checkIn]);
  const end = useMemo(() => new Date(checkOut), [checkOut]);
  const nights = useMemo(() => nightsBetween(start, end), [start, end]);
  const dateText = useMemo(
    () => formatRangeKR(start, end, nights),
    [start, end, nights]
  );
  const citySlug = useMemo(() => toSlug(city), [city]);

  // 헤더 요약 즉시 반영
  useEffect(() => {
    setHeader({
      mode: "detail",
      title: city,
      location: locationLabel,
      checkIn,
      checkOut,
      people,
      rooms,
      dateText,
    });
    return () => resetHeader();
  }, [
    city,
    checkIn,
    checkOut,
    people,
    rooms,
    dateText,
    locationLabel,
    setHeader,
    resetHeader,
  ]);

  return { city, citySlug, checkIn, checkOut, people, rooms, nights };
}
