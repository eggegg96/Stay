// src/components/SortBar.jsx
export default function SortBar({ total }) {
  return (
    <div className="flex justify-between items-center mb-4">
      <span className="text-xl font-bold">총 {total}개 숙소</span>
      <select className="border rounded-lg p-2 text-sm">
        <option>추천순</option>
        <option>낮은 가격순</option>
        <option>높은 가격순</option>
      </select>
    </div>
  );
}
