import { useHeader } from "@contexts/HeaderContext";
import { useAuth } from "@contexts/AuthContext";
import useHomeSearchState from "@hooks/useHomeSearchState";
import ExpandedHeaderSearch from "@search/ExpandedHeaderSearch";
import SummaryBar from "@search/SummaryBar";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Header() {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { header, setHeader } = useHeader();
  const state = useHomeSearchState();

  const [expanded, setExpanded] = useState(false);
  const [initialActive, setInitialActive] = useState("place");

  const isOverseasPage = /^\/overseas/.test(location.pathname);
  const [area, setArea] = useState(isOverseasPage ? "overseas" : "domestic");

  // 디테일 페이지 감지
  const isDetailPage = /^\/(?:domestic|overseas)\/[^/]+$/.test(
    location.pathname
  );

  // 페이지 변경 시 area 상태 동기화
  useEffect(() => {
    const isOverseas = /^\/overseas/.test(location.pathname);
    setArea(isOverseas ? "overseas" : "domestic");
  }, [location.pathname]);

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
        children: String(header.children || 0),
        rooms: String(header.rooms || 1),
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
      rooms: String(payload.rooms),
    });

    // 아동 정보가 있고 해외 숙소일 때만 추가
    if (payload.children && payload.base === "overseas") {
      params.set("children", payload.children);
    }

    navigate(`/${payload.base}?${params.toString()}`);
  };

  /**
   * 로그아웃 핸들러
   *
   * - 백엔드 API 호출로 쿠키 삭제
   * - Context 상태 업데이트
   * - 홈으로 리다이렉트
   */
  const handleLogout = async () => {
    try {
      await logout();
      alert("로그아웃되었습니다");
      navigate("/");
    } catch (error) {
      console.error("로그아웃 실패:", error);
      alert("로그아웃에 실패했습니다");
    }
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
        {/* 로그인 상태에 따라 다른 UI 표시 */}
        <div className="ml-auto mr-8">
          {isLoggedIn ? (
            // 로그인 상태: 사용자 정보 + 로그아웃 버튼
            <div className="flex items-center gap-4">
              <button
                onClick={handleLogout}
                className="border px-4 py-2 border-blue-500 rounded-lg text-blue-500 font-semibold hover:cursor-pointer hover:bg-blue-50"
              >
                로그아웃
              </button>
            </div>
          ) : (
            // 비로그인 상태: 로그인/회원가입 버튼
            <Link
              to="/login"
              className="border px-4 py-2 border-blue-500 rounded-lg text-blue-500 font-semibold hover:bg-blue-50 hover:cursor-pointer"
            >
              로그인/회원가입
            </Link>
          )}
        </div>
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
