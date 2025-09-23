/**
 * 검색 관련 유틸리티 함수들
 */

// 텍스트 정규화 함수들
export const normalizeText = {
  // 공백 제거
  removeSpaces: (str) => str.replace(/\s+/g, ""),

  // 특수문자 제거
  removeSpecialChars: (str) => str.replace(/[^\w\s가-힣]/g, ""),

  // 한글 자모 제거 (ㄱ, ㅏ 등)
  removeKoreanJamo: (str) => str.replace(/[ㄱ-ㅎㅏ-ㅣ]/g, ""),

  // 종합 정규화
  normalize: (str) => {
    if (!str) return "";
    return str.toLowerCase().trim();
  },

  // 검색용 정규화 (공백 + 특수문자 제거)
  normalizeForSearch: (str) => {
    if (!str) return "";
    return normalizeText.removeSpaces(
      normalizeText.removeSpecialChars(str.toLowerCase().trim())
    );
  },
};

// 매칭 점수 계산 상수
export const MATCH_SCORES = {
  EXACT_NAME: 10, // 정확한 이름 매칭
  SPACE_IGNORE_EXACT: 9, // 공백 무시 정확 매칭
  SPACE_IGNORE_CONTAINS: 8, // 공백 무시 포함 매칭
  NAME_PARTS_ALL: 7, // 모든 키워드 부분 포함
  CITY_SLUG: 6, // 도시 코드 매칭
  LOCATION_MATCH: 5, // 위치 매칭
  NAME_PARTIAL: 4, // 부분 이름 매칭
  CATEGORY_MATCH: 3, // 카테고리 매칭
  NO_MATCH: 0, // 매칭 없음
};

/**
 * 숙소와 키워드 간의 매칭 점수를 계산
 * @param {Object} accommodation - 숙소 정보
 * @param {string} keyword - 검색 키워드
 * @param {string} keywordSlug - 키워드 슬러그
 * @returns {number} 매칭 점수
 */
export function calculateMatchScore(accommodation, keyword, keywordSlug) {
  if (!keyword || !accommodation) return MATCH_SCORES.NO_MATCH;

  const keywordLower = normalizeText.normalize(keyword);
  const keywordParts = keywordLower.split(/\s+/).filter(Boolean);
  const normalizedKeyword = normalizeText.normalizeForSearch(keyword);
  const normalizedName = normalizeText.normalizeForSearch(
    accommodation.name || ""
  );

  // 1. 정확한 이름 매칭
  if (accommodation.name?.toLowerCase() === keywordLower) {
    return MATCH_SCORES.EXACT_NAME;
  }

  // 2. 공백 무시 정확 매칭
  if (normalizedName === normalizedKeyword && normalizedKeyword.length > 0) {
    return MATCH_SCORES.SPACE_IGNORE_EXACT;
  }

  // 3. 공백 무시 포함 매칭 (3글자 이상)
  if (
    normalizedKeyword.length > 2 &&
    normalizedName.includes(normalizedKeyword)
  ) {
    return MATCH_SCORES.SPACE_IGNORE_CONTAINS;
  }

  // 4. 모든 키워드 부분이 이름에 포함
  if (
    keywordParts.every((part) =>
      accommodation.name?.toLowerCase().includes(part)
    )
  ) {
    return MATCH_SCORES.NAME_PARTS_ALL;
  }

  // 5. 도시 슬러그 매칭
  if (accommodation.citySlug === keywordSlug) {
    return MATCH_SCORES.CITY_SLUG;
  }

  // 6. 위치 매칭
  if (
    keywordParts.some((part) =>
      accommodation.location?.toLowerCase().includes(part)
    )
  ) {
    return MATCH_SCORES.LOCATION_MATCH;
  }

  // 7. 부분 이름 매칭
  if (
    keywordParts.some((part) =>
      accommodation.name?.toLowerCase().includes(part)
    )
  ) {
    return MATCH_SCORES.NAME_PARTIAL;
  }

  // 8. 카테고리 매칭 (호텔, 모텔 등)
  if (accommodation.category?.toLowerCase().includes(keywordLower)) {
    return MATCH_SCORES.CATEGORY_MATCH;
  }

  return MATCH_SCORES.NO_MATCH;
}

/**
 * 숙소 목록을 검색 키워드로 필터링
 * @param {Array} accommodations - 숙소 목록
 * @param {string} keyword - 검색 키워드
 * @param {string} keywordSlug - 키워드 슬러그
 * @param {string} type - 숙소 타입 (domestic/overseas)
 * @returns {Array} 필터링된 숙소 목록
 */
export function filterAccommodationsByKeyword(
  accommodations,
  keyword,
  keywordSlug,
  type
) {
  if (!accommodations || !Array.isArray(accommodations)) return [];

  return accommodations
    .filter((accommodation) => {
      // 타입 필터
      if (accommodation.type !== type) return false;

      // 키워드가 없으면 모든 숙소 반환
      if (!keyword) return true;

      // 매칭 점수 계산하여 0보다 큰 경우만 포함
      const score = calculateMatchScore(accommodation, keyword, keywordSlug);
      return score > MATCH_SCORES.NO_MATCH;
    })
    .sort((a, b) => {
      // 매칭 점수 기준으로 정렬 (높은 점수 우선)
      const scoreA = calculateMatchScore(a, keyword, keywordSlug);
      const scoreB = calculateMatchScore(b, keyword, keywordSlug);
      return scoreB - scoreA;
    });
}

/**
 * 디버깅용 매칭 정보 반환
 * @param {Object} accommodation - 숙소 정보
 * @param {string} keyword - 검색 키워드
 * @param {string} keywordSlug - 키워드 슬러그
 * @returns {Object} 매칭 상세 정보
 */
export function getMatchDetails(accommodation, keyword, keywordSlug) {
  const score = calculateMatchScore(accommodation, keyword, keywordSlug);
  const normalizedKeyword = normalizeText.normalizeForSearch(keyword);
  const normalizedName = normalizeText.normalizeForSearch(
    accommodation.name || ""
  );

  return {
    accommodationName: accommodation.name,
    keyword,
    keywordSlug,
    normalizedKeyword,
    normalizedName,
    matchScore: score,
    matchType: getMatchType(score),
    finalMatch: score > MATCH_SCORES.NO_MATCH,
  };
}

function getMatchType(score) {
  switch (score) {
    case MATCH_SCORES.EXACT_NAME:
      return "정확한 이름 매칭";
    case MATCH_SCORES.SPACE_IGNORE_EXACT:
      return "공백 무시 정확 매칭";
    case MATCH_SCORES.SPACE_IGNORE_CONTAINS:
      return "공백 무시 포함 매칭";
    case MATCH_SCORES.NAME_PARTS_ALL:
      return "모든 키워드 포함";
    case MATCH_SCORES.CITY_SLUG:
      return "도시 매칭";
    case MATCH_SCORES.LOCATION_MATCH:
      return "위치 매칭";
    case MATCH_SCORES.NAME_PARTIAL:
      return "부분 이름 매칭";
    case MATCH_SCORES.CATEGORY_MATCH:
      return "카테고리 매칭";
    default:
      return "매칭 없음";
  }
}
