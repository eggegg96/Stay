import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { useHeader } from "../contexts/HeaderContext";

import ResultHeader from "../components/ResultHeader";
import Filters from "../components/Filters";
import SortBar from "../components/SortBar";
import ResultList from "../components/ResultList";
import KakaoMap from "../components/KakaoMap";

function toSlug(s = "") {
  return String(s)
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase()
    .replace(/\s/g, "-");
}

export default function OverseasResultsPage() {
  const [params] = useSearchParams();
  const { setHeader, resetHeader } = useHeader();

  const city = params.get("city") || "도쿄"; // ← 사용자 입력 그대로 표시용
  const citySlug = toSlug(city); // ← 내부용
  const checkIn = params.get("checkIn") || "2025-10-14";
  const checkOut = params.get("checkOut") || "2025-10-15";
  const adults = Number(params.get("adults") || 2);
  const rooms = Number(params.get("rooms") || 1);

  useEffect(() => {
    setHeader({
      mode: "detail",
      title: city,
      location: "해외 숙소",
      checkIn,
      checkOut,
      adults,
      rooms,
    });
    return () => resetHeader();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city, checkIn, checkOut, adults, rooms]);

  return (
    <section className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
        {/* 왼쪽 사이드: 지도 -> 필터 */}
        <aside className="order-2 lg:order-1">
          <KakaoMap
            className="w-full h-[180px] rounded-lg border border-slate-200"
            level={4}
            query={city}
          />
          <div className="mt-4">
            <Filters type="domestic" />
          </div>
        </aside>

        {/* 오른쪽 결과 영역 */}
        <section className="order-1 lg:order-2">
          <SortBar total={120} />
          <ResultList type="domestic" city={citySlug} cityLabel={city} />
        </section>
      </div>
    </section>
  );
}
