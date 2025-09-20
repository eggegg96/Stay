import { Link, useNavigate, useLocation } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import { useHeader } from "../contexts/HeaderContext";
import useHomeSearchState from "../hooks/useHomeSearchState";
import SummaryBar from "../components/search/SummaryBar";
import ExpandedHeaderSearch from "../components/search/ExpandedHeaderSearch";
import { formatRangeKR, nightsBetween } from "../utils/dateText";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { header, setHeader } = useHeader();
  const state = useHomeSearchState();

  const [expanded, setExpanded] = useState(false);
  const [initialActive, setInitialActive] = useState("place");
  const [area, setArea] = useState("domestic");

  // 확장 허용 경로: /domestic, /overseas, /accommodation/:id
  const canExpand = /^(\/domestic|\/overseas|\/accommodation\/)/.test(
    location.pathname
  );

  // 경로가 바뀌어 확장 허용이 아니면 자동으로 닫기
  useEffect(() => {
    if (!canExpand && expanded) setExpanded(false);
  }, [canExpand, expanded]);

  // ESC 키로 닫기
  useEffect(() => {
    if (!expanded) return;
    const onKey = (e) => e.key === "Escape" && setExpanded(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expanded]);

  const summary = useMemo(
    () => ({
      place: header.title || "어디로",
      dateText: header.dateText || "날짜",
      guestsText:
        header.people && header.rooms
          ? `성인 ${header.people} · 객실 ${header.rooms}`
          : "인원",
    }),
    [header]
  );

  const openExpanded = (tab) => {
    if (!canExpand) return; // 홈 등에서는 열리지 않음
    setInitialActive(tab);
    setExpanded(true);
  };

  const handleSubmit = (payload) => {
    const params = new URLSearchParams({
      city: payload.city,
      checkIn: payload.checkIn,
      checkOut: payload.checkOut,
      people: String(payload.people),
      rooms: String(payload.rooms ?? 1),
    }).toString();

    // 현재 선택된 탭에 따라 경로 전환
    navigate({ pathname: `/${area}`, search: `?${params}` }, { replace: true });

    // 요약바 즉시 반영
    const start = new Date(payload.checkIn);
    const end = new Date(payload.checkOut);
    const nights = nightsBetween(start, end);
    const dateText = formatRangeKR(start, end, nights);

    setHeader({
      mode: "detail",
      title: payload.city,
      checkIn: payload.checkIn,
      checkOut: payload.checkOut,
      people: payload.people,
      rooms: payload.rooms ?? 1,
      dateText,
    });

    setExpanded(false);
  };

  return (
    <header className="border-b border-slate-200 bg-white relative z-50">
      <div className="p-4 h-20 flex items-center">
        <Link to="/" className="ml-8 text-3xl font-bold">
          Stay
        </Link>

        {!expanded && header.mode === "detail" && (
          <SummaryBar summary={summary} onOpen={openExpanded} />
        )}

        {expanded && canExpand && (
          <nav className="flex gap-6 text-lg font-semibold ml-auto">
            <button
              type="button"
              className={`pb-1 cursor-pointer ${
                area === "domestic"
                  ? "text-blue-500 border-b-2 border-blue-500"
                  : "text-gray-600"
              }`}
              onClick={() => setArea("domestic")}
            >
              국내 숙소
            </button>
            <button
              type="button"
              className={`pb-1 cursor-pointer ${
                area === "overseas"
                  ? "text-blue-500 border-b-2 border-blue-500"
                  : "text-gray-600"
              }`}
              onClick={() => setArea("overseas")}
            >
              해외 숙소
            </button>
          </nav>
        )}

        <Link
          to="/login"
          className="ml-auto mr-8 border px-4 py-2 border-blue-500 rounded-lg text-blue-500 font-semibold"
        >
          로그인/회원가입
        </Link>
      </div>

      {/* 확장 영역: 허용 경로 + 열린 상태일 때만 렌더 */}
      {expanded && canExpand && (
        <div
          className="transition-[max-height] top-12 max-h-[720px]"
          style={{ overflow: "visible" }}
        >
          <div className="relative z-50">
            <ExpandedHeaderSearch
              area={area}
              initialActive={initialActive}
              state={state}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      )}

      {/* 바깥 클릭 닫기: 허용 경로 + 열린 상태일 때만 */}
      {expanded && canExpand && (
        <button
          type="button"
          aria-label="close expanded header"
          onClick={() => setExpanded(false)}
          className="fixed left-0 right-0 bottom-0 top-20 z-40 bg-transparent"
        />
      )}
    </header>
  );
}
