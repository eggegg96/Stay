import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useHeader } from "@contexts/HeaderContext";
import { formatRangeKR, nightsBetween } from "@utils/dateText";

function toSlug(s = "") {
  return String(s)
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase()
    .replace(/\s/g, "-");
}

export default function useResultsHeader(type, locationLabel) {
  const [params] = useSearchParams();
  const { setHeader } = useHeader();

  useEffect(() => {
    console.log("useResultsHeader useEffect 실행됨");

    // 첫 번째 시도: useSearchParams
    let keywordParam = params.get("keyword") || params.get("city");
    let checkInParam = params.get("checkIn");
    let checkOutParam = params.get("checkOut");
    let peopleParam = params.get("people");
    let roomsParam = params.get("rooms");

    console.log("useResultsHeader values:", {
      keywordParam,
      checkInParam,
      checkOutParam,
      peopleParam,
      dateText,
    });

    // 두 번째 시도: window.location.search (새로고침 대응)
    if (!keywordParam) {
      const urlParams = new URLSearchParams(window.location.search);
      keywordParam = urlParams.get("keyword");
      checkInParam = urlParams.get("checkIn");
      checkOutParam = urlParams.get("checkOut");
      peopleParam = urlParams.get("people");
      roomsParam = urlParams.get("rooms");
    }

    // URL 파라미터가 있으면 HeaderContext 설정
    if (keywordParam && checkInParam) {
      console.log("HeaderContext 업데이트:", {
        keyword: keywordParam,
        checkIn: checkInParam,
        checkOut: checkOutParam,
        people: Number(peopleParam || 2),
      });

      setHeader({
        mode: "detail",
        keyword: keywordParam,
        checkIn: checkInParam,
        checkOut: checkOutParam || "2025-10-15",
        people: Number(peopleParam || 2),
        rooms: Number(roomsParam || 1),
        dateText,
      });
    }
  }, []); // 마운트 시 한 번만 실행

  // 직접 URL에서 파라미터 추출
  const urlParams = new URLSearchParams(window.location.search);
  const keywordParam = urlParams.get("keyword");
  const checkInParam = urlParams.get("checkIn") || "2025-10-14";
  const checkOutParam = urlParams.get("checkOut") || "2025-10-15";
  const peopleParam = Number(urlParams.get("people") || 2);
  const roomsParam = Number(urlParams.get("rooms") || 1);

  // 계산된 값들
  const keyword = keywordParam || (type === "overseas" ? "도쿄" : "서울");
  const checkIn = checkInParam;
  const checkOut = checkOutParam;
  const people = peopleParam;
  const rooms = roomsParam;

  // 파생값들
  const start = useMemo(() => new Date(checkIn), [checkIn]);
  const end = useMemo(() => new Date(checkOut), [checkOut]);
  const nights = useMemo(() => nightsBetween(start, end), [start, end]);
  const dateText = useMemo(
    () => formatRangeKR(start, end, nights),
    [start, end, nights]
  );
  const keywordSlug = useMemo(() => toSlug(keyword), [keyword]);

  return {
    keyword,
    keywordSlug,
    checkIn,
    checkOut,
    people,
    rooms,
    nights,
  };
}
