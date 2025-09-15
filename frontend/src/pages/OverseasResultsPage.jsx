import { useSearchParams } from "react-router-dom";
import ResultHeader from "../components/ResultHeader";
import Filters from "../components/Filters";
import SortBar from "../components/SortBar";
import ResultList from "../components/ResultList";

export default function OverseasResultsPage() {
  const [params] = useSearchParams();
  const city = params.get("city") || "도쿄";
  const checkIn = params.get("checkIn") || "2025-10-14";
  const checkOut = params.get("checkOut") || "2025-10-15";
  const adults = params.get("adults") || 2;
  const rooms = params.get("rooms") || 1;

  return (
    <section className="max-w-6xl mx-auto p-6">
      {/* 상단 검색 요약 */}
      <ResultHeader
        city={city}
        checkIn={checkIn}
        checkOut={checkOut}
        adults={adults}
        rooms={rooms}
      />

      {/* 본문 레이아웃 */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        {/* 좌측 필터 */}
        <Filters type="overseas" />

        {/* 우측 결과 */}
        <div>
          <SortBar total={85} />
          <ResultList type="overseas" city={city} />
        </div>
      </div>
    </section>
  );
}
