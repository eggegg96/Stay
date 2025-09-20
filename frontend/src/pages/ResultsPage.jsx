import useResultsHeader from "../hooks/useResultsHeader";
import Filters from "../components/Filters";
import SortBar from "../components/SortBar";
import ResultList from "../components/ResultList";
import KakaoMap from "../components/KakaoMap";
import { ACCOMMODATIONS } from "../data/accommodations";

export default function ResultsPage({ type, title }) {
  const { city, citySlug } = useResultsHeader(type, title);

  // 실제 결과 개수 계산
  const listForCount = ACCOMMODATIONS.filter(
    (a) =>
      a.type === type &&
      (a.citySlug === citySlug || a.location?.includes?.(city))
  );

  return (
    <section className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
        <aside className="order-2 lg:order-1">
          <KakaoMap
            className="w-full h-[180px] rounded-lg border border-slate-200"
            level={4}
            query={city}
          />
          <div className="mt-4">
            <Filters type={type} />
          </div>
        </aside>

        <section className="order-1 lg:order-2">
          <SortBar total={listForCount.length} />
          <ResultList type={type} city={citySlug} cityLabel={city} />
        </section>
      </div>
    </section>
  );
}
