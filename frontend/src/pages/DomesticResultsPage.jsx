import { useSearchParams } from "react-router-dom";
import ResultHeader from "../components/ResultHeader";
import Filters from "../components/Filters";
import SortBar from "../components/SortBar";
import ResultList from "../components/ResultList";

// 내부용: 문자열을 슬러그로 변환
function toSlug(s = "") {
  return String(s)
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase()
    .replace(/\s/g, "-");
}

export default function DomesticResultsPage() {
  const [params] = useSearchParams();

  // 화면 표시는 사용자가 입력한 그대로
  const city = params.get("city") || "서울";
  // 내부 처리(필터·API)만 슬러그 사용
  const citySlug = toSlug(city);

  const checkIn = params.get("checkIn") || "2025-10-14";
  const checkOut = params.get("checkOut") || "2025-10-15";
  const adults = Number(params.get("adults") || 2);
  const rooms = Number(params.get("rooms") || 1);

  return (
    <section className="max-w-6xl mx-auto p-6">
      <ResultHeader
        city={city} // ← 그대로 노출: "도쿄" 입력하면 "도쿄"로 보임
        checkIn={checkIn}
        checkOut={checkOut}
        adults={adults}
        rooms={rooms}
      />
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        <Filters type="domestic" />
        <div>
          <SortBar total={120} />
          <ResultList type="domestic" city={citySlug} cityLabel={city} />
        </div>
      </div>
    </section>
  );
}
