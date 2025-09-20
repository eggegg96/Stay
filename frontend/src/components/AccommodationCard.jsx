import { Link } from "react-router-dom";

function formatKRW(n) {
  if (typeof n !== "number") return null;
  return n.toLocaleString();
}

export default function AccommodationCard({
  id,
  name,
  location,
  desc,
  type,
  images,
  rooms,
}) {
  // 대표가: rooms 배열에서 최저가를 뽑아 표시
  const dayUseMin = rooms
    ?.map((r) => r.dayUse)
    .filter(Boolean)
    .reduce((m, v) => Math.min(m, v), Infinity);
  const stayMin = rooms
    ?.map((r) => r.stay)
    .filter(Boolean)
    .reduce((m, v) => Math.min(m, v), Infinity);
  const hasDayUse = Number.isFinite(dayUseMin);
  const hasStay = Number.isFinite(stayMin);

  return (
    <Link
      to={`/${type}/${id}`}
      className="flex pb-4 border-b border-slate-200 shadow transition gap-4"
    >
      <img
        src={images?.[0]}
        alt={name}
        className="w-96 h-56 object-cover rounded-md"
      />
      <div className="flex flex-col">
        <div className="text-lg font-bold">{name}</div>
        <div className="text-slate-500">{location}</div>
        <div className="text-sm text-gray-600">{desc}</div>
      </div>
      <div className="flex flex-col justify-end flex-grow pr-4">
        {hasDayUse && (
          <div className="text-xl font-bold ml-auto">
            대실 : {formatKRW(dayUseMin)}원
          </div>
        )}
        {hasStay && (
          <div className="text-xl font-bold ml-auto">
            숙박 : {formatKRW(stayMin)}원
          </div>
        )}
      </div>
    </Link>
  );
}
