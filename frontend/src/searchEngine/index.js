/**
 * 검색 기능 통합 진입점
 */
import { SearchEngine } from "./searchEngine.js";
import { convertToLocationSlug } from "@utils/locationAliases";

// 싱글톤 검색 엔진 인스턴스
const searchEngine = new SearchEngine();

// === 기존 API 호환성 유지 ===

/**
 * 숙소 목록을 검색 키워드로 필터링 (기존 API)
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
  return searchEngine.search(accommodations, keyword, keywordSlug, type);
}

/**
 * 숙소와 키워드 간의 매칭 점수를 계산 (기존 API)
 * @param {Object} accommodation - 숙소 정보
 * @param {string} keyword - 검색 키워드
 * @param {string} keywordSlug - 키워드 슬러그
 * @returns {number} 매칭 점수
 */
export function calculateMatchScore(accommodation, keyword, keywordSlug) {
  return searchEngine.scoringEngine.calculateScore(
    accommodation,
    keyword,
    keywordSlug
  );
}

/**
 * 디버깅용 매칭 정보 반환 (기존 API)
 * @param {Object} accommodation - 숙소 정보
 * @param {string} keyword - 검색 키워드
 * @param {string} keywordSlug - 키워드 슬러그
 * @returns {Object} 매칭 상세 정보
 */
export function getMatchDetails(accommodation, keyword, keywordSlug) {
  return searchEngine.getMatchDetails(accommodation, keyword, keywordSlug);
}

// === 새로운 간편 API ===

/**
 * 간편한 검색 API
 * @param {Object} options - 검색 옵션
 * @param {Array} options.accommodations - 숙소 목록
 * @param {string} options.keyword - 검색 키워드
 * @param {string} options.type - 숙소 타입 (domestic/overseas)
 * @returns {Array} 필터링된 숙소 목록
 */
export function searchAccommodations({ accommodations, keyword, type }) {
  const keywordSlug = convertToLocationSlug(keyword, type);
  return searchEngine.search(accommodations, keyword, keywordSlug, type);
}

// === 기존 모듈들 re-export (호환성) ===

// 기존 정규화 함수들 호환성
export { TextNormalizer as normalizeText } from "./textNormalizer.js";
export { MATCH_SCORES } from "./constants.js";
export { SearchEngine } from "./searchEngine.js";

// 직접 인스턴스 접근 (고급 사용자용)
export { searchEngine };
