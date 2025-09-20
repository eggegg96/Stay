export default function SummaryBar({ summary, onOpen }) {
  // summary = { place, dateText, guestsText }
  const cellBase =
    "flex-1 h-11 px-2 flex items-center hover:bg-gray-200 rounded-lg transition cursor-pointer text-sm font-bold";

  return (
    <div className="ml-16 max-w-300 flex items-center bg-gray-100 border-transparent rounded-md">
      <button
        type="button"
        className={cellBase}
        onClick={() => onOpen("place")}
      >
        <span className="px-4 py-2 whitespace-nowrap truncate">
          {summary.place}
        </span>
      </button>
      <button type="button" className={cellBase} onClick={() => onOpen("date")}>
        <span className="px-4 py-2 whitespace-nowrap">{summary.dateText}</span>
      </button>
      <button
        type="button"
        className={cellBase}
        onClick={() => onOpen("guests")}
      >
        <span className="px-4 py-2 whitespace-nowrap">
          {summary.guestsText}
        </span>
      </button>
    </div>
  );
}
