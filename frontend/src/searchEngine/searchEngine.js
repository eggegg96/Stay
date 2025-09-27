/**
 * 메인 검색 엔진
 */
import { ScoringEngine } from "./scoringEngine.js";
import { MATCH_SCORES, MATCH_TYPE_NAMES } from "./constants.js";

export class SearchEngine {
  constructor() {
    this.scoringEngine = new ScoringEngine();
  }

  /**
   * 숙소 목록을 검색 키워드로 필터링
   * @param {Array} accommodations - 숙소 목록
   * @param {string} keyword - 검색 키워드
   * @param {string} keywordSlug - 키워드 슬러그
   * @param {string} type - 숙소 타입 (domestic/overseas)
   * @returns {Array} 필터링된 숙소 목록
   */
  search(accommodations, keyword, keywordSlug, type) {
    if (!accommodations || !Array.isArray(accommodations)) return [];

    return accommodations
      .filter((accommodation) => {
        // 타입 필터
        if (accommodation.type !== type) return false;

        // 키워드가 없으면 모든 숙소 반환
        if (!keyword) return true;

        // 매칭 점수 계산하여 0보다 큰 경우만 포함
        const score = this.scoringEngine.calculateScore(
          accommodation,
          keyword,
          keywordSlug
        );
        return score > MATCH_SCORES.NO_MATCH;
      })
      .sort((a, b) => {
        // 매칭 점수 기준으로 정렬 (높은 점수 우선)
        const scoreA = this.scoringEngine.calculateScore(
          a,
          keyword,
          keywordSlug
        );
        const scoreB = this.scoringEngine.calculateScore(
          b,
          keyword,
          keywordSlug
        );
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
  getMatchDetails(accommodation, keyword, keywordSlug) {
    const score = this.scoringEngine.calculateScore(
      accommodation,
      keyword,
      keywordSlug
    );
    const keywordAliases =
      this.scoringEngine.aliasResolver.getKeywordAliases(keyword);

    return {
      accommodationName: accommodation.name,
      keyword,
      keywordSlug,
      keywordAliases,
      matchScore: score,
      matchType: MATCH_TYPE_NAMES[score] || "매칭 없음",
      finalMatch: score > MATCH_SCORES.NO_MATCH,
    };
  }
}
