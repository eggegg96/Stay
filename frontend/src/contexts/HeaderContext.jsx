import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from "react";

const HeaderContext = createContext(null);

const DEFAULT = {
  mode: "default", // "default" | "detail"
  keyword: "",
  checkIn: "",
  checkOut: "",
  people: 2,
  children: 0, // 아동 수
  childrenAges: [], // 아동 연령 배열
  rooms: 1,
  dateText: "", // "09.20 토 - 09.21 일 (1박)" 같은 요약 텍스트
};

export function HeaderProvider({ children }) {
  const [header, setHeader] = useState(DEFAULT);

  const mergeHeader = useCallback(
    (next) => {
      console.log(
        "HeaderContext 업데이트됨:",
        next,
        "from:",
        new Error().stack
      );
      setHeader((cur) => ({ ...cur, ...next }));
    },
    [] // 의존성 배열 제거 - setHeader는 안정적인 함수이므로 불필요
  );

  const resetHeader = useCallback(() => {
    setHeader(DEFAULT);
  }, []);

  // value도 메모이즈해서 매 렌더마다 새 객체 안 만들도록
  const value = useMemo(
    () => ({ header, setHeader: mergeHeader, resetHeader }),
    [header, mergeHeader, resetHeader]
  );

  return (
    <HeaderContext.Provider value={value}>{children}</HeaderContext.Provider>
  );
}

export function useHeader() {
  const ctx = useContext(HeaderContext);
  if (!ctx) throw new Error("useHeader must be used within HeaderProvider");
  return ctx;
}
