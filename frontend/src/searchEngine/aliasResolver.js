/**
 * 지역 alias 해결 담당
 */
import { ALL_LOCATION_ALIASES } from "@utils/locationAliases";

export class AliasResolver {
  constructor(aliasMap = ALL_LOCATION_ALIASES) {
    this.aliasMap = aliasMap;
  }

  /**
   * 키워드와 관련된 모든 alias 찾기
   * @param {string} keyword - 검색 키워드
   * @returns {Array} 관련 alias 배열
   */
  getKeywordAliases(keyword) {
    if (!keyword) return [];

    const normalized = keyword.toLowerCase().trim();
    const aliases = new Set();

    // 직접 매핑 찾기
    Object.entries(this.aliasMap).forEach(([alias, target]) => {
      if (alias === normalized || target === normalized) {
        aliases.add(alias);
        aliases.add(target);
      }
    });

    // 부분 매칭도 고려
    Object.keys(this.aliasMap).forEach((alias) => {
      if (alias.includes(normalized) || normalized.includes(alias)) {
        aliases.add(alias);
      }
    });

    return Array.from(aliases);
  }

  /**
   * 키워드가 alias 맵에 있는지 확인
   * @param {string} keyword - 검색 키워드
   * @returns {boolean} alias 존재 여부
   */
  hasAlias(keyword) {
    const normalized = keyword?.toLowerCase().trim();
    return normalized && this.aliasMap.hasOwnProperty(normalized);
  }

  /**
   * 키워드의 표준 slug 반환
   * @param {string} keyword - 검색 키워드
   * @returns {string|null} 표준 slug 또는 null
   */
  resolveToSlug(keyword) {
    const normalized = keyword?.toLowerCase().trim();
    return this.aliasMap[normalized] || null;
  }
}
