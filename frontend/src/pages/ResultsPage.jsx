import useResultsHeader from "../hooks/useResultsHeader";
import useFilteredAccommodations from "../hooks/useFilteredAccommodations";
import SortBar from "../components/SortBar";
import Filters from "../components/filters";
import KakaoMap from "../components/KakaoMap";
import ResultList from "../components/ResultList";

export default function ResultsPage({ type, title }) {
  const { keyword, keywordSlug } = useResultsHeader(type, title);
  const { totalCount } = useFilteredAccommodations(type, keyword, keywordSlug);

  return (
    <section className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
        <aside className="order-2 lg:order-1">
          <KakaoMap
            className="w-full h-[180px] rounded-lg border border-slate-200"
            level={4}
            query={keyword}
          />
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
