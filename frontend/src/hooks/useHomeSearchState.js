import { useState, useRef, useEffect, useCallback } from "react";

export default function useHomeSearchState(init = {}) {
  const [keyword, setKeyword] = useState(init.keyword ?? "");
  const [people, setPeople] = useState(init.people ?? "2");
  const [children, setChildren] = useState(init.children ?? "0");
  const [childrenAges, setChildrenAges] = useState(init.childrenAges ?? []);
  const [rooms, setRooms] = useState(init.rooms ?? "1");
  const [range, setRange] = useState([
    {
      startDate: init.startDate ?? new Date(),
      endDate: init.endDate ?? new Date(Date.now() + 86400000),
      key: "selection",
    },
  ]);

  const [open, setOpen] = useState(false);
  const pickerRef = useRef(null);

  // 아동 수와 연령 배열 동기화
  useEffect(() => {
    const childCount = Number(children);
    if (childCount > childrenAges.length) {
      // 아동 수 증가: 새로운 아동 연령 추가 (기본값: 빈 문자열)
      const newAges = [...childrenAges];
      while (newAges.length < childCount) {
        newAges.push("");
      }
      setChildrenAges(newAges);
    } else if (childCount < childrenAges.length) {
      // 아동 수 감소: 마지막 아동 연령 제거
      setChildrenAges(childrenAges.slice(0, childCount));
    }
  }, [children, childrenAges]);

  useEffect(() => {
    const h = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  // 외부에서 상태 업데이트할 수 있는 함수
  const updateState = useCallback(
    (newState) => {
      if (newState.keyword !== undefined) setKeyword(newState.keyword);
      if (newState.people !== undefined) setPeople(newState.people);
      if (newState.children !== undefined) setChildren(newState.children);
      if (newState.childrenAges !== undefined)
        setChildrenAges(newState.childrenAges);
      if (newState.rooms !== undefined) setRooms(newState.rooms);
      if (newState.startDate || newState.endDate) {
        setRange([
          {
            startDate: newState.startDate ?? range[0].startDate,
            endDate: newState.endDate ?? range[0].endDate,
            key: "selection",
          },
        ]);
      }
    },
    [range]
  );

  // 개별 아동 연령 업데이트 함수
  const updateChildAge = useCallback(
    (index, age) => {
      const newAges = [...childrenAges];
      newAges[index] = age;
      setChildrenAges(newAges);
    },
    [childrenAges]
  );

  return {
    keyword,
    setKeyword,
    people,
    setPeople,
    children,
    setChildren,
    childrenAges,
    setChildrenAges,
    updateChildAge,
    rooms,
    setRooms,
    range,
    setRange,
    open,
    setOpen,
    pickerRef,
    updateState,
  };
}
