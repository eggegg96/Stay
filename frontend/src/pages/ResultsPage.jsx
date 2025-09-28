import useResultsHeader from "@hooks/useResultsHeader";
import useFilteredAccommodations from "@hooks/useFilteredAccommodations";
import SortBar from "@accommodation/SortBar";
import Filters from "@filters";
import ResultList from "@accommodation/ResultList";
import MapContainer from "@common/MapContainer";

export default function ResultsPage({ type, title }) {
  const { keyword, keywordSlug } = useResultsHeader(type, title);
  const { totalCount } = useFilteredAccommodations(type, keyword, keywordSlug);

  return (
    <section className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
        <aside className="order-2 lg:order-1">
          {/* 구글맵 높이 제한을 위한 컨테이너 추가 */}
          <div className="w-full h-[180px] rounded-lg border border-slate-200 overflow-hidden">
            <MapContainer
              accommodation={{ type }}
              query={keyword}
              lat={null}
              lng={null}
              variant="result"
              className="w-full h-full"
            />
          </div>
          <div className="mt-4">
            <Filters type={type} />
          </div>
        </aside>

        <section className="order-1 lg:order-2">
          <SortBar total={totalCount} />
          <ResultList type={type} keywordSlug={keywordSlug} keyword={keyword} />
        </section>
      </div>
    </section>
  );
}
