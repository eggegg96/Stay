import { useState, useRef, useEffect } from "react";

export default function useHomeSearchState(init = {}) {
  const [keyword, setKeyword] = useState(init.keyword ?? "");
  const [people, setPeople] = useState(init.people ?? "2");
  const [range, setRange] = useState([
    {
      startDate: init.startDate ?? new Date(),
      endDate: init.endDate ?? new Date(Date.now() + 86400000),
      key: "selection",
    },
  ]);

  const [open, setOpen] = useState(false);
  const pickerRef = useRef(null);

  useEffect(() => {
    const h = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return {
    keyword,
    setKeyword,
    people,
    setPeople,
    range,
    setRange,
    open,
    setOpen,
    pickerRef,
  };
}
