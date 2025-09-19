import HotelCard from "./HotelCard";
import { HOTELS } from "../data/hotels";

export default function ResultList({ type, city, cityLabel }) {
  const list = HOTELS.filter(
    (h) => h.type === type && h.location.toLowerCase().includes(city)
  );

  if (list.length === 0) {
    return (
      <div className="p-6 text-center">
        <span className="font-bold">{cityLabel}에 검색된 숙소가 없습니다</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {list.map((hotel) => (
        <HotelCard key={hotel.id} {...hotel} />
      ))}
    </div>
  );
}
