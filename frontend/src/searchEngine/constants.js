/**
 * 검색 관련 상수 정의
 */

// 매칭 점수 계산 상수
export const MATCH_SCORES = {
  EXACT_NAME: 10, // 정확한 이름 매칭
  ALIAS_EXACT: 9, // Alias 정확 매칭
  SPACE_IGNORE_EXACT: 8, // 공백 무시 정확 매칭
  SPACE_IGNORE_CONTAINS: 7, // 공백 무시 포함 매칭
  NAME_PARTS_ALL: 6, // 모든 키워드 부분 포함
  CITY_SLUG: 5, // 도시 코드 매칭
  LOCATION_MATCH: 4, // 위치 매칭
  NAME_PARTIAL: 3, // 부분 이름 매칭
  CATEGORY_MATCH: 2, // 카테고리 매칭
  NO_MATCH: 0, // 매칭 없음
};

// 매칭 타입 이름 매핑
export const MATCH_TYPE_NAMES = {
  [MATCH_SCORES.EXACT_NAME]: "정확한 이름 매칭",
  [MATCH_SCORES.ALIAS_EXACT]: "Alias 정확 매칭",
  [MATCH_SCORES.SPACE_IGNORE_EXACT]: "공백 무시 정확 매칭",
  [MATCH_SCORES.SPACE_IGNORE_CONTAINS]: "공백 무시 포함 매칭",
  [MATCH_SCORES.NAME_PARTS_ALL]: "모든 키워드 포함",
  [MATCH_SCORES.CITY_SLUG]: "도시 매칭",
  [MATCH_SCORES.LOCATION_MATCH]: "위치 매칭",
  [MATCH_SCORES.NAME_PARTIAL]: "부분 이름 매칭",
  [MATCH_SCORES.CATEGORY_MATCH]: "카테고리 매칭",
  [MATCH_SCORES.NO_MATCH]: "매칭 없음",
};
