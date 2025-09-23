import { useHeader } from "@contexts/HeaderContext";

export default function SummaryBar({ onOpen }) {
  const { header } = useHeader();

  const cellBase =
    "flex-1 h-11 px-2 flex items-center hover:bg-gray-200 rounded-lg transition cursor-pointer text-sm font-bold";

  console.log("SummaryBar header:", header);
  return (
    <div className="ml-16 max-w-300 flex items-center bg-gray-100 border-transparent rounded-md">
      <button
        type="button"
        className={cellBase}
        onClick={() => onOpen("place")}
      >
        <span className="px-4 py-2 whitespace-nowrap truncate">
          {header.keyword || "어디로"}
        </span>
      </button>
      <button type="button" className={cellBase} onClick={() => onOpen("date")}>
        <span className="px-4 py-2 whitespace-nowrap">
          {header.dateText || "언제"}
        </span>
      </button>
      <button
        type="button"
        className={cellBase}
        onClick={() => onOpen("guests")}
      >
        <span className="px-4 py-2 whitespace-nowrap">
          {`성인 ${header.people || 2} · 객실 ${header.rooms || 1}`}{" "}
          {/* summary.guestsText → header 값 사용 */}
        </span>
      </button>
    </div>
  );
}
