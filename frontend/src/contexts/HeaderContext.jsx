import { createContext, useContext, useState, useMemo } from "react";

const HeaderContext = createContext(null);

export function HeaderProvider({ children }) {
  const [state, setState] = useState({
    mode: "default", // "default" | "detail"
    title: "",
    location: "",
    checkIn: "",
    checkOut: "",
    adults: 2,
    rooms: 1,
  });

  const value = useMemo(
    () => ({
      header: state,
      setHeader: (next) => setState((cur) => ({ ...cur, ...next })),
      resetHeader: () =>
        setState({
          mode: "default",
          title: "",
          location: "",
          checkIn: "",
          checkOut: "",
          people: 2,
          rooms: 1,
        }),
    }),
    [state]
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
