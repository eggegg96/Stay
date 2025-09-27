/**
 * 매칭 점수 계산 엔진
 */
import { MATCH_SCORES } from "./constants.js";
import { TextNormalizer } from "./textNormalizer.js";
import { AliasResolver } from "./aliasResolver.js";

export class ScoringEngine {
  constructor() {
    this.aliasResolver = new AliasResolver();
  }

  /**
   * 숙소와 키워드 간의 매칭 점수를 계산
   * @param {Object} accommodation - 숙소 정보
   * @param {string} keyword - 검색 키워드
   * @param {string} keywordSlug - 키워드 슬러그
   * @returns {number} 매칭 점수
   */
  calculateScore(accommodation, keyword, keywordSlug) {
    if (!keyword || !accommodation) return MATCH_SCORES.NO_MATCH;

    // 각 매칭 방법들을 순서대로 확인 (높은 점수부터)
    const scores = [
      this._checkExactName(accommodation, keyword),
      this._checkAliasMatch(accommodation, keyword, keywordSlug),
      this._checkSpaceIgnoreExact(accommodation, keyword),
      this._checkSpaceIgnoreContains(accommodation, keyword),
      this._checkAllKeywordParts(accommodation, keyword),
      this._checkCitySlug(accommodation, keywordSlug),
      this._checkLocationMatch(accommodation, keyword),
      this._checkNamePartial(accommodation, keyword),
      this._checkCategoryMatch(accommodation, keyword),
    ];

    // 가장 높은 점수 반환
    return Math.max(...scores);
  }

  // === 개별 매칭 방법들 ===

  _checkExactName(accommodation, keyword) {
    const keywordLower = TextNormalizer.normalize(keyword);
    return accommodation.name?.toLowerCase() === keywordLower
      ? MATCH_SCORES.EXACT_NAME
      : MATCH_SCORES.NO_MATCH;
  }

  _checkAliasMatch(accommodation, keyword, keywordSlug) {
    // 기본 slug 매칭
    if (accommodation.citySlug === keywordSlug) {
      return MATCH_SCORES.ALIAS_EXACT;
    }

    // 확장 alias 검사
    const keywordAliases = this.aliasResolver.getKeywordAliases(keyword);
    const normalizedLocation = TextNormalizer.normalizeForSearch(
      accommodation.location || ""
    );
    const normalizedName = TextNormalizer.normalizeForSearch(
      accommodation.name || ""
    );

    for (const alias of keywordAliases) {
      if (
        normalizedLocation.includes(alias) ||
        normalizedName.includes(alias)
      ) {
        return MATCH_SCORES.ALIAS_EXACT;
      }
    }

    return MATCH_SCORES.NO_MATCH;
  }

  _checkSpaceIgnoreExact(accommodation, keyword) {
    const normalizedKeyword = TextNormalizer.normalizeForSearch(keyword);
    const normalizedName = TextNormalizer.normalizeForSearch(
      accommodation.name || ""
    );

    return normalizedName === normalizedKeyword && normalizedKeyword.length > 0
      ? MATCH_SCORES.SPACE_IGNORE_EXACT
      : MATCH_SCORES.NO_MATCH;
  }

  _checkSpaceIgnoreContains(accommodation, keyword) {
    const normalizedKeyword = TextNormalizer.normalizeForSearch(keyword);
    const normalizedName = TextNormalizer.normalizeForSearch(
      accommodation.name || ""
    );

    return normalizedKeyword.length > 2 &&
      normalizedName.includes(normalizedKeyword)
      ? MATCH_SCORES.SPACE_IGNORE_CONTAINS
      : MATCH_SCORES.NO_MATCH;
  }

  _checkAllKeywordParts(accommodation, keyword) {
    const keywordLower = TextNormalizer.normalize(keyword);
    const keywordParts = keywordLower.split(/\s+/).filter(Boolean);

    return keywordParts.every((part) =>
      accommodation.name?.toLowerCase().includes(part)
    )
      ? MATCH_SCORES.NAME_PARTS_ALL
      : MATCH_SCORES.NO_MATCH;
  }

  _checkCitySlug(accommodation, keywordSlug) {
    return accommodation.citySlug === keywordSlug
      ? MATCH_SCORES.CITY_SLUG
      : MATCH_SCORES.NO_MATCH;
  }

  _checkLocationMatch(accommodation, keyword) {
    const keywordLower = TextNormalizer.normalize(keyword);
    const keywordParts = keywordLower.split(/\s+/).filter(Boolean);
    const keywordAliases = this.aliasResolver.getKeywordAliases(keyword);

    const hasPartMatch = keywordParts.some((part) =>
      accommodation.location?.toLowerCase().includes(part)
    );

    const hasAliasMatch = keywordAliases.some((alias) =>
      accommodation.location?.toLowerCase().includes(alias)
    );

    return hasPartMatch || hasAliasMatch
      ? MATCH_SCORES.LOCATION_MATCH
      : MATCH_SCORES.NO_MATCH;
  }

  _checkNamePartial(accommodation, keyword) {
    const keywordLower = TextNormalizer.normalize(keyword);
    const keywordParts = keywordLower.split(/\s+/).filter(Boolean);

    return keywordParts.some((part) =>
      accommodation.name?.toLowerCase().includes(part)
    )
      ? MATCH_SCORES.NAME_PARTIAL
      : MATCH_SCORES.NO_MATCH;
  }

  _checkCategoryMatch(accommodation, keyword) {
    const keywordLower = TextNormalizer.normalize(keyword);
    return accommodation.category?.toLowerCase().includes(keywordLower)
      ? MATCH_SCORES.CATEGORY_MATCH
      : MATCH_SCORES.NO_MATCH;
  }
}
