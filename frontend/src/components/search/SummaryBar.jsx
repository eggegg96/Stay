import { useHeader } from "@contexts/HeaderContext";
import { useLocation } from "react-router-dom";

export default function SummaryBar({ onOpen }) {
  const { header } = useHeader();
  const location = useLocation();

  // 현재 경로를 기반으로 지역 타입 판단
  const isOverseas = location.pathname.startsWith("/overseas");

  const cellBase =
    "flex-1 h-11 px-2 flex items-center hover:bg-gray-200 rounded-lg transition cursor-pointer text-sm font-bold";

  // 인원 정보 텍스트 생성
  const getGuestsText = () => {
    if (isOverseas) {
      // 해외: 성인 + 아동 + 객실 정보 표시
      const adultsText = `성인 ${header.people || 2}명`;
      const childrenText = ` · 아동 ${header.children || 0}명`;
      const roomsText = ` · 객실 ${header.rooms || 1}개`;

      return `${adultsText}${childrenText}${roomsText}`;
    } else {
      // 국내: 단순 인원수만 표시
      return `인원 ${header.people || 2}명`;
    }
  };

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
        <span className="px-4 py-2 whitespace-nowrap">{getGuestsText()}</span>
      </button>
    </div>
  );
}
