import { useSearchParams } from "react-router-dom";
import ResultHeader from "../components/ResultHeader";
import Filters from "../components/Filters";
import SortBar from "../components/SortBar";
import ResultList from "../components/ResultList";

function toSlug(s = "") {
  return String(s)
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase()
    .replace(/\s/g, "-");
}

export default function OverseasResultsPage() {
  const [params] = useSearchParams();

  const city = params.get("city") || "도쿄"; // ← 사용자 입력 그대로 표시용
  const citySlug = toSlug(city); // ← 내부용

  const checkIn = params.get("checkIn") || "2025-10-14";
  const checkOut = params.get("checkOut") || "2025-10-15";
  const adults = Number(params.get("adults") || 2);
  const rooms = Number(params.get("rooms") || 1);

  return (
    <section className="max-w-6xl mx-auto p-6">
      <ResultHeader
        city={city} // "tokyo"로 들어오면 tokyo, "도쿄"로 들어오면 도쿄 그대로 표시
        checkIn={checkIn}
        checkOut={checkOut}
        adults={adults}
        rooms={rooms}
      />
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        <Filters type="overseas" />
        <div>
          <SortBar total={85} /> {/* 총 숙소 개수는 임의로 넣음 */}
          <ResultList type="overseas" city={citySlug} />
        </div>
      </div>
    </section>
  );
}
