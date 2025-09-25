import AccommodationCard from "./AccommodationCard";
import { useLocation } from "react-router-dom";
import useFilteredAccommodations from "@hooks/useFilteredAccommodations";
import { getMatchDetails } from "@utils/searchUtils";

export default function ResultList({ type, keywordSlug, keyword }) {
  const location = useLocation();
  const { search } = location;
  const { filteredAccommodations } = useFilteredAccommodations(
    type,
    keyword,
    keywordSlug
  );

  if (filteredAccommodations.length === 0) {
    return (
      <div className="mt-2 text-sm text-slate-500">
        "{keyword ?? keywordSlug}"에 해당하는 숙소가 없습니다.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredAccommodations.map((item) => (
        <AccommodationCard
          key={item.id}
          id={item.id}
          type={item.type}
          name={item.name}
          location={item.location}
          desc={item.desc}
          images={item.images}
          rooms={item.rooms}
          search={search}
        />
      ))}
    </div>
  );
}
