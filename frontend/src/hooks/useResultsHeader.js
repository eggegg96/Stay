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
  const { setHeader } = useHeader(); // header 제거 - 의존성 순환 방지

  useEffect(() => {
    console.log("useResultsHeader useEffect 실행됨");

    // URL 파라미터 읽기
    let keywordParam = params.get("keyword") || params.get("city");
    let checkInParam = params.get("checkIn");
    let checkOutParam = params.get("checkOut");
    let peopleParam = params.get("people");
    let childrenParam = params.get("children"); // 🆕 아동 연령 문자열
    let roomsParam = params.get("rooms");

    // window.location.search로 다시 한번 확인 (새로고침 대응)
    if (!keywordParam) {
      const urlParams = new URLSearchParams(window.location.search);
      keywordParam = urlParams.get("keyword");
      checkInParam = urlParams.get("checkIn");
      checkOutParam = urlParams.get("checkOut");
      peopleParam = urlParams.get("people");
      childrenParam = urlParams.get("children");
      roomsParam = urlParams.get("rooms");
    }

    // 🆕 아동 연령 파싱
    let childrenCount = 0;
    let childrenAges = [];

    if (childrenParam && type === "overseas") {
      // "12,8,5" → ["12", "8", "5"]
      childrenAges = childrenParam.split(",").filter(Boolean);
      childrenCount = childrenAges.length;

      console.log("파싱된 아동 정보:", {
        childrenParam,
        childrenAges,
        childrenCount,
      });
    }

    // URL 파라미터가 있으면 HeaderContext 설정
    if (keywordParam && checkInParam) {
      const start = new Date(checkInParam);
      const end = new Date(checkOutParam || "2025-10-15");
      const nights = nightsBetween(start, end);
      const dateText = formatRangeKR(start, end, nights);

      console.log("HeaderContext 업데이트:", {
        keyword: keywordParam,
        checkIn: checkInParam,
        checkOut: checkOutParam || "2025-10-15",
        people: Number(peopleParam || 2),
        children: childrenCount,
        childrenAges: childrenAges,
        rooms: Number(roomsParam || 1),
      });

      setHeader({
        mode: "detail",
        keyword: keywordParam,
        checkIn: checkInParam,
        checkOut: checkOutParam || "2025-10-15",
        people: Number(peopleParam || 2),
        children: childrenCount, // 🆕 파싱된 아동 수
        childrenAges: childrenAges, // 🆕 파싱된 아동 연령 배열
        rooms: Number(roomsParam || 1),
        dateText,
      });
    }
  }, [params, setHeader, type]); // header 의존성 제거

  // 직접 URL에서 파라미터 추출
  const urlParams = new URLSearchParams(window.location.search);
  const keywordParam = urlParams.get("keyword");
  const checkInParam = urlParams.get("checkIn") || "2025-10-14";
  const checkOutParam = urlParams.get("checkOut") || "2025-10-15";
  const peopleParam = Number(urlParams.get("people") || 2);
  const roomsParam = Number(urlParams.get("rooms") || 1);

  // 🆕 아동 정보 처리
  const childrenParam = urlParams.get("children");
  let childrenCount = 0;
  let childrenAges = [];

  if (childrenParam && type === "overseas") {
    childrenAges = childrenParam.split(",").filter(Boolean);
    childrenCount = childrenAges.length;
  }

  // 계산된 값들
  const keyword = keywordParam || (type === "overseas" ? "도쿄" : "서울");
  const checkIn = checkInParam;
  const checkOut = checkOutParam;
  const people = peopleParam;
  const children = childrenCount;
  const rooms = roomsParam;

  // 파생값들
  const start = useMemo(() => new Date(checkIn), [checkIn]);
  const end = useMemo(() => new Date(checkOut), [checkOut]);
  const nights = useMemo(() => nightsBetween(start, end), [start, end]);
  const keywordSlug = useMemo(() => toSlug(keyword), [keyword]);

  return {
    keyword,
    keywordSlug,
    checkIn,
    checkOut,
    people,
    childrenAges,
    rooms,
    nights,
  };
}
