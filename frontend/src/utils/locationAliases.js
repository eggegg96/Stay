/**
 * 지역 검색 Alias 매핑
 * 다양한 검색어를 표준 citySlug로 변환
 */

// 국내 지역 alias 매핑
export const DOMESTIC_LOCATION_ALIASES = {
  // 제주 관련
  제주: "jeju",
  제주도: "jeju",
  제주시: "jeju",
  제주특별자치도: "jeju",
  제주특자치도: "jeju",
  jeju: "jeju",

  // 서울 관련
  서울: "seoul",
  서울시: "seoul",
  서울특별시: "seoul",
  seoul: "seoul",

  // 서울 세부 지역
  강남: "seoul",
  강남구: "seoul",
  강남역: "seoul",
  홍대: "seoul",
  홍익대: "seoul",
  홍대입구: "seoul",
  명동: "seoul",
  이태원: "seoul",
  잠실: "seoul",
  건대: "seoul",
  신촌: "seoul",
  종로: "seoul",
  을지로: "seoul",
  동대문: "seoul",
  성수: "seoul",

  // 부산 관련
  부산: "busan",
  부산시: "busan",
  부산광역시: "busan",
  busan: "busan",

  // 부산 세부 지역
  해운대: "busan",
  광안리: "busan",
  서면: "busan",
  남포동: "busan",

  // 경기도
  수원: "suwon",
  수원시: "suwon",
  인천: "incheon",
  인천시: "incheon",
  인천광역시: "incheon",
  성남: "seongnam",
  성남시: "seongnam",
  분당: "seongnam",
  분당구: "seongnam",
  안양: "anyang",
  안산: "ansan",
  용인: "yongin",
  고양: "goyang",
  의정부: "uijeongbu",
  파주: "paju",

  // 강원도
  강릉: "gangneung",
  강릉시: "gangneung",
  춘천: "chuncheon",
  춘천시: "chuncheon",
  속초: "sokcho",
  원주: "wonju",
  평창: "pyeongchang",
  정선: "jeongseon",

  // 충청도
  대전: "daejeon",
  대전시: "daejeon",
  대전광역시: "daejeon",
  천안: "cheonan",
  청주: "cheongju",
  충주: "chungju",
  공주: "gongju",
  보령: "boryeong",

  // 전라도
  광주: "gwangju",
  광주시: "gwangju",
  광주광역시: "gwangju",
  전주: "jeonju",
  전주시: "jeonju",
  여수: "yeosu",
  여수시: "yeosu",
  목포: "mokpo",
  순천: "suncheon",
  완주: "wanju",

  // 경상도
  대구: "daegu",
  대구시: "daegu",
  대구광역시: "daegu",
  울산: "ulsan",
  울산시: "ulsan",
  울산광역시: "ulsan",
  경주: "gyeongju",
  경주시: "gyeongju",
  포항: "pohang",
  창원: "changwon",
  진주: "jinju",
  안동: "andong",

  // 기타
  세종: "sejong",
  세종시: "sejong",
  세종특별자치시: "sejong",
};

// 해외 지역 alias 매핑
export const OVERSEAS_LOCATION_ALIASES = {
  // 일본
  도쿄: "tokyo",
  동경: "tokyo",
  tokyo: "tokyo",
  일본수도: "tokyo",

  오사카: "osaka",
  osaka: "osaka",
  일본오사카: "osaka",

  후쿠오카: "fukuoka",
  fukuoka: "fukuoka",
  일본후쿠오카: "fukuoka",

  교토: "kyoto",
  kyoto: "kyoto",
  일본교토: "kyoto",

  요코하마: "yokohama",
  나고야: "nagoya",
  삿포로: "sapporo",
  고베: "kobe",
  히로시마: "hiroshima",
  센다이: "sendai",
  가와사키: "kawasaki",

  // 중국
  베이징: "beijing",
  북경: "beijing",
  beijing: "beijing",

  상하이: "shanghai",
  shanghai: "shanghai",

  시안: "xian",
  광저우: "guangzhou",
  선전: "shenzhen",
  청두: "chengdu",
  항저우: "hangzhou",

  // 동남아시아
  방콕: "bangkok",
  bangkok: "bangkok",
  태국방콕: "bangkok",

  싱가포르: "singapore",
  singapore: "singapore",

  쿠알라룸푸르: "kualalumpur",
  kl: "kualalumpur",

  자카르타: "jakarta",
  발리: "bali",
  푸켓: "phuket",
  치앙마이: "chiangmai",
  파타야: "pattaya",
  호치민: "hochiminh",
  하노이: "hanoi",
  다낭: "danang",

  // 유럽
  파리: "paris",
  paris: "paris",
  프랑스파리: "paris",

  런던: "london",
  london: "london",
  영국런던: "london",

  로마: "rome",
  rome: "rome",
  이탈리아로마: "rome",

  바르셀로나: "barcelona",
  barcelona: "barcelona",
  스페인바르셀로나: "barcelona",

  암스테르담: "amsterdam",
  베를린: "berlin",
  프라하: "prague",
  빈: "vienna",
  취리히: "zurich",

  // 미주
  뉴욕: "newyork",
  newyork: "newyork",
  ny: "newyork",
  미국뉴욕: "newyork",

  로스앤젤레스: "losangeles",
  la: "losangeles",
  "los angeles": "losangeles",
  losangeles: "losangeles",

  라스베가스: "lasvegas",
  vegas: "lasvegas",
  "las vegas": "lasvegas",
  lasvegas: "lasvegas",

  샌프란시스코: "sanfrancisco",
  "san francisco": "sanfrancisco",
  sanfrancisco: "sanfrancisco",
  sf: "sanfrancisco",

  토론토: "toronto",
  toronto: "toronto",
  캐나다토론토: "toronto",

  밴쿠버: "vancouver",
  vancouver: "vancouver",
  캐나다밴쿠버: "vancouver",

  // 오세아니아
  시드니: "sydney",
  sydney: "sydney",
  호주시드니: "sydney",

  멜버른: "melbourne",
  melbourne: "melbourne",
  호주멜버른: "melbourne",

  오클랜드: "auckland",
  auckland: "auckland",
  뉴질랜드오클랜드: "auckland",
};

// 통합 alias 매핑
export const ALL_LOCATION_ALIASES = {
  ...DOMESTIC_LOCATION_ALIASES,
  ...OVERSEAS_LOCATION_ALIASES,
};

/**
 * 검색 키워드를 표준 citySlug로 변환
 * @param {string} keyword - 검색 키워드
 * @param {string} type - 'domestic' 또는 'overseas'
 * @returns {string} 변환된 citySlug
 */
export function convertToLocationSlug(keyword, type = "domestic") {
  if (!keyword) return "";

  // 정규화: 소문자, 공백 제거
  const normalized = keyword.toLowerCase().trim().replace(/\s+/g, "");

  // 타입에 따른 alias 선택
  const aliases =
    type === "overseas" ? OVERSEAS_LOCATION_ALIASES : DOMESTIC_LOCATION_ALIASES;

  // alias에서 찾기
  if (aliases[normalized]) {
    return aliases[normalized];
  }

  // 부분 매칭 시도 (공백 포함 원본으로)
  const originalNormalized = keyword.toLowerCase().trim();
  if (aliases[originalNormalized]) {
    return aliases[originalNormalized];
  }

  // alias에 없으면 기존 toSlug 로직 사용
  return keyword.toLowerCase().trim().replace(/\s+/g, "-");
}

/**
 * 디버깅을 위한 alias 변환 정보 반환
 * @param {string} keyword - 검색 키워드
 * @param {string} type - 'domestic' 또는 'overseas'
 * @returns {Object} 변환 상세 정보
 */
export function getLocationSlugDetails(keyword, type = "domestic") {
  const normalized = keyword?.toLowerCase().trim().replace(/\s+/g, "") || "";
  const originalNormalized = keyword?.toLowerCase().trim() || "";

  const aliases =
    type === "overseas" ? OVERSEAS_LOCATION_ALIASES : DOMESTIC_LOCATION_ALIASES;

  const foundInAliases = aliases[normalized] || aliases[originalNormalized];
  const finalSlug = convertToLocationSlug(keyword, type);

  return {
    originalKeyword: keyword,
    normalizedKeyword: normalized,
    type,
    foundInAliases: !!foundInAliases,
    aliasResult: foundInAliases || null,
    finalSlug,
    debugInfo: {
      checkedKeys: [normalized, originalNormalized],
      availableAliases: Object.keys(aliases)
        .filter(
          (key) =>
            key.includes(normalized.slice(0, 2)) ||
            normalized.includes(key.slice(0, 2))
        )
        .slice(0, 5), // 관련 alias 몇 개만 표시
    },
  };
}
