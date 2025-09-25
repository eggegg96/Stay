import { useEffect, useRef, useState } from "react";

const LIMITS = {
  domestic: {
    maxPeople: 9,
    maxRooms: 1, // 국내는 객실 선택 불가
    maxChildren: 0, // 국내는 아동 선택 불가
  },
  overseas: {
    maxPeople: 36,
    maxRooms: 9,
    maxChildren: 10, // 해외는 아동 최대 10명
  },
};

const AGE_OPTIONS = [
  { value: "2", label: "만 3세 미만" },
  { value: "3", label: "만 3세" },
  { value: "4", label: "만 4세" },
  { value: "5", label: "만 5세" },
  { value: "6", label: "만 6세" },
  { value: "7", label: "만 7세" },
  { value: "8", label: "만 8세" },
  { value: "9", label: "만 9세" },
  { value: "10", label: "만 10세" },
  { value: "11", label: "만 11세" },
  { value: "12", label: "만 12세" },
  { value: "13", label: "만 13세" },
  { value: "14", label: "만 14세" },
  { value: "15", label: "만 15세" },
  { value: "16", label: "만 16세" },
  { value: "17", label: "만 17세" },
];

export default function BookingPopover({
  open,
  onClose,
  people,
  setPeople,
  rooms = 1,
  setRooms,
  children = 0,
  setChildren,
  childrenAges = [], // props로 받음
  updateChildAge, // props로 받음
  area = "domestic", // "domestic" | "overseas"
}) {
  const ref = useRef(null);
  const isOverseas = area === "overseas";
  const limits = LIMITS[area];

  useEffect(() => {
    const h = (e) => {
      if (open && ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open, onClose]);

  if (!open) return null;

  // 인원 수 조정 + 객실 수 자동 조정
  const decreasePeople = () => {
    const newPeopleCount = Math.max(1, Number(people) - 1);
    setPeople(String(newPeopleCount));

    // 성인 수가 줄어들면 객실 수도 그에 맞게 조정
    if (isOverseas && Number(rooms) > newPeopleCount) {
      setRooms(String(newPeopleCount));
    }
  };

  const increasePeople = () =>
    setPeople(String(Math.min(limits.maxPeople, Number(people) + 1)));

  // 아동 수 조정 (해외만)
  const decreaseChildren = () =>
    setChildren(String(Math.max(0, Number(children) - 1)));
  const increaseChildren = () =>
    setChildren(String(Math.min(limits.maxChildren, Number(children) + 1)));

  // 객실 수 조정 (해외만)
  // 중요: 객실 수는 성인 수를 초과할 수 없음 (아동 보호 규정)
  const maxAllowedRooms = Math.min(limits.maxRooms, Number(people));

  const decreaseRooms = () => setRooms(String(Math.max(1, Number(rooms) - 1)));
  const increaseRooms = () =>
    setRooms(String(Math.min(maxAllowedRooms, Number(rooms) + 1)));

  return (
    <div
      ref={ref}
      className="absolute top-14 right-0 z-50 w-[380px] border border-slate-200 rounded-2xl bg-white p-6 shadow-xl"
    >
      <div className="space-y-6">
        {/* 성인/인원 선택 */}
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-[180px]">
            <div className="text-md font-semibold leading-5">
              {isOverseas ? "성인" : "인원"}
            </div>
            <p className="mt-1 text-xs text-slate-500 leading-4">
              {isOverseas
                ? "만 18세 이상"
                : "유아 및 아동도 인원수에 포함해주세요."}
            </p>
          </div>
          <div className="flex items-center gap-3 whitespace-nowrap">
            <button
              type="button"
              onClick={decreasePeople}
              disabled={Number(people) <= 1}
              className="w-8 h-8 rounded-full border border-slate-200 text-lg leading-none cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:border-slate-400"
              aria-label={`${isOverseas ? "성인" : "인원"} 인원 감소`}
            >
              −
            </button>
            <span className="w-6 text-center font-bold cursor-default">
              {people}
            </span>
            <button
              type="button"
              onClick={increasePeople}
              disabled={Number(people) >= limits.maxPeople}
              className="w-8 h-8 rounded-full border border-slate-200 text-lg leading-none cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:border-slate-400"
              aria-label={`${isOverseas ? "성인" : "인원"} 인원 증가`}
            >
              +
            </button>
          </div>
        </div>

        {/* 아동 선택 - 해외 숙소만 */}
        {isOverseas && (
          <>
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-[180px]">
                <div className="text-md font-semibold leading-5">아동</div>
                <p className="mt-1 text-xs text-slate-500 leading-4">
                  만 0세 ~ 17세
                </p>
              </div>
              <div className="flex items-center gap-3 whitespace-nowrap">
                <button
                  type="button"
                  onClick={decreaseChildren}
                  disabled={Number(children) <= 0}
                  className="w-8 h-8 rounded-full border border-slate-200 text-lg leading-none cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:border-slate-400"
                  aria-label="아동 인원 감소"
                >
                  −
                </button>
                <span className="w-6 text-center font-bold cursor-default">
                  {children}
                </span>
                <button
                  type="button"
                  onClick={increaseChildren}
                  disabled={Number(children) >= limits.maxChildren}
                  className="w-8 h-8 rounded-full border border-slate-200 text-lg leading-none cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:border-slate-400"
                  aria-label="아동 인원 증가"
                >
                  +
                </button>
              </div>
            </div>

            {/* 아동별 연령 선택 드롭다운 */}
            {Number(children) > 0 && (
              <div className="space-y-3 pl-4 border-l-2 border-blue-100">
                <div className="text-sm font-medium text-slate-700">
                  아동별 연령 선택
                </div>
                {Array.from({ length: Number(children) }, (_, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <label className="text-sm text-slate-600">
                      아동 {index + 1}
                    </label>
                    <select
                      value={childrenAges[index] || "12"}
                      onChange={(e) => updateChildAge(index, e.target.value)}
                      className="border border-slate-200 rounded-lg px-3 py-1 text-sm bg-white hover:border-slate-400 focus:border-blue-500 focus:outline-none min-w-[90px]"
                    >
                      {AGE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}

                {/* 요금 안내 */}
                <div className="mt-2 text-xs text-slate-400 bg-slate-50 p-2 rounded">
                  💡 만 0-2세: 무료 / 만 3-12세: 아동요금 / 만 13-17세: 성인요금
                </div>
              </div>
            )}
          </>
        )}

        {/* 객실 선택 - 해외 숙소만 */}
        {isOverseas && (
          <div className="flex items-center justify-between gap-4 border-t border-slate-200 pt-6">
            <div className="min-w-[180px]">
              <div className="text-md font-semibold leading-5">객실</div>
              <p className="mt-1 text-xs text-slate-500 leading-4">
                총 인원이 이용하실 객실 수
              </p>
            </div>
            <div className="flex items-center gap-3 whitespace-nowrap">
              <button
                type="button"
                onClick={decreaseRooms}
                disabled={Number(rooms) <= 1}
                className="w-8 h-8 rounded-full border border-slate-200 text-lg leading-none cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:border-slate-400"
                aria-label="객실 수 감소"
              >
                −
              </button>
              <span className="w-6 text-center font-bold cursor-default">
                {rooms}
              </span>
              <button
                type="button"
                onClick={increaseRooms}
                disabled={Number(rooms) >= maxAllowedRooms}
                className="w-8 h-8 rounded-full border border-slate-200 text-lg leading-none cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:border-slate-400"
                aria-label="객실 수 증가"
              >
                +
              </button>
            </div>
          </div>
        )}

        {/* 안내 텍스트 */}
        <div className="border-t border-slate-200 pt-4">
          <p className="text-xs text-slate-400 leading-relaxed">
            {isOverseas ? (
              <>
                • 최대 성인 {limits.maxPeople}명, 아동 {limits.maxChildren}명,
                객실 {limits.maxRooms}개까지 선택 가능
                <br />• 객실 수는 성인 수를 초과할 수 없습니다 (아동 보호 규정)
                <br />• 각 객실마다 만 18세 이상 성인 1명 이상 필수
                <br />• 유아는 보호자와 함께 숙박해야 합니다
              </>
            ) : (
              <>
                • 최대 {limits.maxPeople}명까지 선택 가능
                <br />• 객실별 최대 인원은 숙소 정보를 확인해주세요
              </>
            )}
          </p>

          {/* 현재 설정 요약 - 해외만 */}
          {isOverseas && Number(children) > 0 && (
            <div className="mt-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-xs text-blue-700 font-medium">
                현재 예약 구성
              </div>
              <div className="text-xs text-blue-600 mt-1">
                성인 {people}명 + 아동 {children}명 = 총{" "}
                {Number(people) + Number(children)}명
                <br />
                객실 {rooms}개 (각 객실마다 성인 보호자 배정)
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
