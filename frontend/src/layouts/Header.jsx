import { Link, useNavigate, useLocation } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import { useHeader } from "@contexts/HeaderContext";
import useHomeSearchState from "@hooks/useHomeSearchState";
import SummaryBar from "@search/SummaryBar";
import ExpandedHeaderSearch from "@search/ExpandedHeaderSearch";
import { formatRangeKR, nightsBetween } from "@utils/dateText";

export default function Header() {
  console.log("Header 컴포넌트가 새 버전으로 로드됨 - 테스트");
  const navigate = useNavigate();
  const location = useLocation();
  const { header, setHeader } = useHeader();
  const state = useHomeSearchState();

  const [expanded, setExpanded] = useState(false);
  const [initialActive, setInitialActive] = useState("place");
  const [area, setArea] = useState("domestic");

  // 디테일 페이지 감지
  const isDetailPage = /^\/(?:domestic|overseas)\/[^/]+$/.test(
    location.pathname
  );

  // 확장 허용 경로: /domestic, /overseas, /accommodation/:id
  const canExpand =
    /^\/domestic(?:\/|$)|^\/overseas(?:\/|$)|^\/accommodation\/\d+/.test(
      location.pathname
    ) || isDetailPage;

  // 경로가 바뀌어 확장 허용이 아니면 자동으로 닫기
  useEffect(() => {
    if (!canExpand && expanded) setExpanded(false);
  }, [canExpand, expanded]);

  const openExpanded = (tab) => {
    if (!canExpand) return;

    // HeaderContext의 현재 값을 검색 폼에 설정
    if (header.keyword) {
      state.updateState({
        keyword: header.keyword,
        people: String(header.people || 2),
        startDate: header.checkIn ? new Date(header.checkIn) : new Date(),
        endDate: header.checkOut
          ? new Date(header.checkOut)
          : new Date(Date.now() + 86400000),
      });
    }

    setInitialActive(tab);
    setExpanded(true);
  };

  const handleSubmit = (payload) => {
    const params = new URLSearchParams({
      keyword: payload.keyword,
      checkIn: payload.checkIn,
      checkOut: payload.checkOut,
      people: String(payload.people),
      rooms: String(payload.rooms ?? 1),
    }).toString();

    // HeaderContext 업데이트
    const start = new Date(payload.checkIn);
    const end = new Date(payload.checkOut);
    const nights = nightsBetween(start, end);
    const dateText = formatRangeKR(start, end, nights);

    setHeader({
      mode: "detail",
      keyword: payload.keyword,
      checkIn: payload.checkIn,
      checkOut: payload.checkOut,
      people: payload.people,
      rooms: payload.rooms ?? 1,
      dateText,
    });

    // 디테일 페이지에서 키워드 변경 여부 체크
    if (isDetailPage) {
      const currentKeyword = header.keyword || "";
      const newKeyword = payload.keyword || "";

      // 키워드가 변경되지 않았으면 현재 페이지에서 URL 파라미터만 업데이트
      if (currentKeyword.trim() === newKeyword.trim()) {
        const newUrl = `${location.pathname}?${params}`;
        window.history.pushState({}, "", newUrl);
        setExpanded(false);
        return;
      }

      // 키워드가 변경되었으면 검색 결과 페이지로 이동
    }

    // 검색 결과 페이지로 이동
    setTimeout(() => {
      navigate({ pathname: `/${area}`, search: `?${params}` });
    }, 0);
    setExpanded(false);
  };

  return (
    <header className="border-b border-slate-200 bg-white relative z-50">
      <div className="p-4 h-20 flex items-center">
        <Link to="/" className="ml-8 text-3xl font-bold">
          Stay
        </Link>

        {!expanded && canExpand && <SummaryBar onOpen={openExpanded} />}
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
              isDetailPage={isDetailPage}
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
