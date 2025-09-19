export const HOTELS = [
  {
    id: "895",
    type: "domestic",
    name: "길동 MARI-마리",
    citySlug: "seoul",
    location: "서울 강동구 길동 387-7",
    desc: "길동역 도보 3분 · 평점 9.3",
    images: [
      "/images/mari/main.webp",
      "/images/mari/1.webp",
      "/images/mari/2.webp",
      "/images/mari/3.webp",
      "/images/mari/4.webp",
    ],
    rooms: [
      { name: "B-타입", dayUse: 22000, stay: 70000 },
      { name: "A-타입", dayUse: 27000, stay: 80000 },
    ],
  },
  {
    id: "12",
    type: "overseas",
    name: "도쿄 호텔",
    citySlug: "tokyo",
    location: "일본 도쿄 신주쿠",
    desc: "신주쿠역 도보 5분 · 평점 8.9",
    images: [
      "/images/tokyo/main.jpg",
      "/images/tokyo/1.jpg",
      "/images/tokyo/2.jpg",
      "/images/tokyo/3.jpg",
    ],
    rooms: [{ name: "스탠다드룸", dayUse: 45000, stay: 120000 }],
  },
];
