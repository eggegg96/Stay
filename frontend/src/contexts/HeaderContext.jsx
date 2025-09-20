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
  title: "",
  location: "",
  checkIn: "",
  checkOut: "",
  dateText: "", // "09.20 토 - 09.21 일 (1박)" 같은 요약 텍스트
  people: 2,
  rooms: 1,
};

export function HeaderProvider({ children }) {
  const [header, setHeader] = useState(DEFAULT);

  // setHeader/ resetHeader를 콜백으로 고정해 렌더 사이클 안정화
  const mergeHeader = useCallback(
    (next) => setHeader((cur) => ({ ...cur, ...next })),
    []
  );

  const resetHeader = useCallback(() => setHeader(DEFAULT), []);

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
