import { createContext, useContext, useState, useEffect } from "react";
import authApi from "@/lib/api/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // 초기값 true

  /**
   * 로그인 상태 확인
   */
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // HttpOnly 쿠키 유효성 확인을 위해 API 요청
      // TODO: /api/auth/me 구현 후 실제 사용자 정보 가져오기
      try {
        await authApi.getCurrentUser();
        // 성공하면 로그인 상태
        setIsLoggedIn(true);
        setUser({ email: "user@example.com" }); // TODO: 실제 사용자 정보
      } catch (error) {
        // 401 에러면 비로그인 상태
        console.log("비로그인 상태");
        setIsLoggedIn(false);
        setUser(null);
      }
    } catch (error) {
      console.error("인증 상태 확인 실패:", error);
      setIsLoggedIn(false);
      setUser(null);
    } finally {
      setLoading(false); // 로딩 완료
    }
  };

  const login = async (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
  };

  const logout = async () => {
    try {
      await authApi.logout();
      setIsLoggedIn(false);
      setUser(null);
    } catch (error) {
      console.error("로그아웃 실패:", error);
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  const value = {
    isLoggedIn,
    user,
    loading,
    login,
    logout,
    checkAuthStatus,
  };

  // 로딩 중일 때는 아무것도 렌더링 안 함
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
