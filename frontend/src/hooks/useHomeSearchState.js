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

  // 외부에서 상태 업데이트할 수 있는 함수 추가
  const updateState = (newState) => {
    if (newState.keyword !== undefined) setKeyword(newState.keyword);
    if (newState.people !== undefined) setPeople(newState.people);
    if (newState.startDate || newState.endDate) {
      setRange([
        {
          startDate: newState.startDate ?? range[0].startDate,
          endDate: newState.endDate ?? range[0].endDate,
          key: "selection",
        },
      ]);
    }
  };

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
    updateState, // 새로 추가
  };
}
