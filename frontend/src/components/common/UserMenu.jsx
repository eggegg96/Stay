import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function UserMenu() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const getUserId = (email) => {
    if (!email) return "사용자";
    return email.split("@")[0];
  };

  /**
   * 로그아웃 핸들러
   */
  const handleLogout = async () => {
    try {
      await logout();
      setIsOpen(false);
      alert("로그아웃되었습니다");
      navigate("/");
    } catch (error) {
      console.error("로그아웃 실패:", error);
      alert("로그아웃에 실패했습니다");
    }
  };

  /**
   * 바깥 클릭 시 메뉴 닫기
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 hover:cursor-pointer transition-colors"
      >
        <div className="text-left">
          <div className="text-sm font-bold text-gray-900">
            {getUserId(user?.email)}
          </div>
          <div className="text-xs font-bold text-blue-600">
            <span>{user?.grade || "BASIC"}</span>
          </div>
        </div>
        <svg
          className="w-5 h-5 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="py-2">
            <button
              onClick={() => {
                setIsOpen(false);
                alert("마이페이지 준비 중입니다");
              }}
              className="w-full text-left px-4 py-3 hover:bg-gray-100 hover:cursor-pointer border-b border-gray-200"
            >
              <div className="text-sm font-semibold text-gray-900 flex items-center justify-between">
                <span>{getUserId(user?.email)}</span>
                <span className="text-gray-400">&gt;</span>
              </div>
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                alert("준비 중입니다");
              }}
              className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100 hover:cursor-pointer flex items-center justify-between"
            >
              <span className="text-sm text-blue-600 font-semibold">
                {user?.grade || "BASIC"}
              </span>
              <span className="text-xs">혜택 보기</span>
            </button>
            <div className="flex border-t border-b border-gray-200">
              <button
                onClick={() => {
                  setIsOpen(false);
                  alert("포인트 페이지 준비 중입니다");
                }}
                className="flex-1 px-4 py-3 text-sm hover:bg-gray-100 hover:cursor-pointer border-r border-gray-200"
              >
                <div className="text-center">
                  <div className="text-xs text-gray-600 mb-1">포인트</div>
                  <div className="text-sm font-semibold text-gray-900">
                    {user?.points?.toLocaleString() || 0}P
                  </div>
                </div>
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  alert("쿠폰 페이지 준비 중입니다");
                }}
                className="flex-1 px-4 py-3 text-sm hover:bg-gray-100 hover:cursor-pointer"
              >
                <div className="text-center">
                  <div className="text-xs text-gray-600 mb-1">쿠폰</div>
                  <div className="text-sm font-semibold text-gray-900">0장</div>
                </div>
              </button>
            </div>
            <button
              onClick={() => {
                setIsOpen(false);
                alert("준비 중입니다");
              }}
              className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100 hover:cursor-pointer"
            >
              예약 내역
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                alert("준비 중입니다");
              }}
              className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100 hover:cursor-pointer"
            >
              찜 목록
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100 hover:cursor-pointer border-t border-gray-200"
            >
              로그아웃
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
