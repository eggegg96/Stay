// src/components/ResultHeader.jsx
export default function ResultHeader({
  city,
  checkIn,
  checkOut,
  adults,
  rooms,
}) {
  return (
    <header className="mb-6">
      <h1 className="text-2xl font-bold">{city} 숙소 검색 결과</h1>
      <p className="text-slate-600 text-sm">
        {checkIn} ~ {checkOut} · 성인 {adults}명 · 객실 {rooms}개
      </p>
    </header>
  );
}
