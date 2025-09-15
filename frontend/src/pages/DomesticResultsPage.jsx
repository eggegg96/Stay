import { useSearchParams } from "react-router-dom";
import ResultHeader from "../components/ResultHeader";
import Filters from "../components/Filters";
import SortBar from "../components/SortBar";
import ResultList from "../components/ResultList";

const SLUG_TO_LABEL = { seoul: "서울" /* ...생략... */ };

export default function DomesticResultsPage() {
  const [params] = useSearchParams();
  const city = params.get("city") || "서울";
  const checkIn = params.get("checkIn") || "2025-10-14";
  const checkOut = params.get("checkOut") || "2025-10-15";
  const adults = params.get("adults") || 2;
  const rooms = params.get("rooms") || 1;
  const displayCity = SLUG_TO_LABEL[city] || city;

  return (
    <section className="max-w-6xl mx-auto p-6">
      <ResultHeader
        city={displayCity}
        checkIn={checkIn}
        checkOut={checkOut}
        adults={adults}
        rooms={rooms}
      />
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        <Filters type="domestic" />
        <div>
          <SortBar total={120} />
          <ResultList type="domestic" city={city} />
        </div>
      </div>
    </section>
  );
}
