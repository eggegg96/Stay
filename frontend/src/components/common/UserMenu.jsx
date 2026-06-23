import { useState, useRef, useEffect } from "react";
import { useAuth } from "@contexts/AuthContext";
import { UI_DELAY } from "@/constants/common";

export default function UserMenu() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const getUserDisplayName = () => {
    if (!user) return "사용자";

    console.log("🔍 User 정보:", user);

    // 닉네임이 있으면 닉네임 우선
    if (user.nickname) {
      return user.nickname;
    }

    // 닉네임 없으면 이메일 아이디 부분 (fallback)
    if (user.email) {
      return user.email.split("@")[0];
    }

    return "사용자";
  };

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/";
    } catch (error) {
      console.error("로그아웃 실패:", error);
      alert("로그아웃에 실패했습니다");
    }
  };

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
        className="flex items-center gap-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-1 hover:cursor-pointer">
          <div className="text-left flex flex-col">
            <span className="font-bold text-sm">{getUserDisplayName()}</span>
            <span className="text-xs font-bold text-blue-600">
              {user?.grade || "BASIC"}
            </span>
          </div>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24  "
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="py-2">
            {/* 사용자 정보 - 닉네임 표시 */}
            <button
              onClick={() => {
                setIsOpen(false);
                alert("마이페이지 준비 중입니다");
              }}
              className="w-full text-left px-4 py-3 hover:bg-gray-100 border-b border-gray-200 hover:cursor-pointer"
            >
              <div className="text-sm font-semibold text-gray-900 flex items-center justify-between">
                {/* 닉네임 표시 (없으면 이메일 앞부분) */}
                <span>{getUserDisplayName()}</span>
                <span className="text-gray-400">&gt;</span>
              </div>
            </button>

            {/* 등급 정보 */}
            <button
              onClick={() => {
                setIsOpen(false);
                alert("준비 중입니다");
              }}
              className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100 flex items-center justify-between hover:cursor-pointer"
            >
              <span className="text-sm text-blue-600 font-semibold">
                {user?.grade || "BASIC"}
              </span>
              <span className="text-xs">혜택 보기</span>
            </button>

            {/* 포인트/쿠폰 */}
            <div className="flex border-t border-b border-gray-200">
              <button
                onClick={() => {
                  setIsOpen(false);
                  alert("포인트 페이지 준비 중입니다");
                }}
                className="flex-1 px-4 py-3 text-sm hover:bg-gray-100 border-r border-gray-200 hover:cursor-pointer"
              >
                <div className="text-xs text-gray-500">포인트</div>
                <div className="font-semibold">
                  {user?.points?.toLocaleString() || 0}P
                </div>
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  alert("쿠폰 페이지 준비 중입니다");
                }}
                className="flex-1 px-4 py-3 text-sm hover:bg-gray-100 hover:cursor-pointer"
              >
                <div className="text-xs text-gray-500">쿠폰</div>
                <div className="font-semibold">{user?.coupons || 0}장</div>
              </button>
            </div>

            {/* 메뉴 항목들 */}
            <button
              onClick={() => {
                setIsOpen(false);
                alert("예약 내역 페이지 준비 중입니다");
              }}
              className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100 hover:cursor-pointer"
            >
              예약 내역
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                alert("찜 목록 페이지 준비 중입니다");
              }}
              className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100 hover:cursor-pointer"
            >
              찜 목록
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                alert("리뷰 관리 페이지 준비 중입니다");
              }}
              className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100 border-b border-gray-200 hover:cursor-pointer"
            >
              리뷰 관리
            </button>

            {/* 로그아웃 */}
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100 hover:cursor-pointer"
            >
              로그아웃
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
