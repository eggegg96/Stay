function formatKRW(n) {
  if (typeof n !== "number") return null;
  return n.toLocaleString();
}

export default function AccommodationCard({
  id,
  name,
  citySlug,
  desc,
  type,
  images,
  rooms,
  search = "", // ResultList에서 받은 현재 URL의 쿼리스트
}) {
  const detailPath = `${
    type === "domestic" ? "/domestic" : "/overseas"
  }/${id}${search}`;

  const handleClick = (e) => {
    e.preventDefault();
    // 새 창으로 열기
    window.open(detailPath, "_blank", "noopener,noreferrer");
  };

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
    <div
      onClick={handleClick}
      className="flex gap-4 rounded-xl border border-slate-200 p-3 hover:shadow transition cursor-pointer"
    >
      <img
        src={images?.[0]}
        alt={name}
        className="w-96 h-56 object-cover rounded-md"
      />
      <div className="flex flex-col text-sm">
        <div className="text-lg font-bold">{name}</div>
        <div className="text-slate-500">{citySlug}</div>
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
    </div>
  );
}
