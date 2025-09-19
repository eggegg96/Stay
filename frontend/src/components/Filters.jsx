export default function Filters({ type }) {
  return (
    <aside className="bg-white p-4 rounded-xl shadow-sm">
      <h2 className="font-semibold mb-3">필터</h2>
      <ul className="space-y-2 text-sm text-slate-700">
        <li>가격대</li>
        <li>숙소 유형</li>
        <li>편의시설</li>
        <li>환불 정책</li>
      </ul>
    </aside>
  );
}
