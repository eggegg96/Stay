import HotelCard from "./HotelCard";

const MOCKS = [
  {
    id: 1,
    name: "신라호텔 서울",
    location: "서울 중구 · 5성급 호텔",
    desc: "럭셔리 호텔",
  },
  {
    id: 2,
    name: "롯데시티호텔 명동",
    location: "서울 중구 · 4성급 호텔",
    desc: "비즈니스 호텔",
  },
];

export default function ResultList({ type, city }) {
  return (
    <div className="space-y-4">
      {MOCKS.map((h) => (
        <HotelCard key={h.id} {...h} />
      ))}
    </div>
  );
}
