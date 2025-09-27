/**
 * 텍스트 정규화 유틸리티
 */

export class TextNormalizer {
  // 공백 제거
  static removeSpaces(str) {
    return str.replace(/\s+/g, "");
  }

  // 특수문자 제거
  static removeSpecialChars(str) {
    return str.replace(/[^\w\s가-힣]/g, "");
  }

  // 한글 자모 제거 (ㄱ, ㅏ 등)
  static removeKoreanJamo(str) {
    return str.replace(/[ㄱ-ㅎㅏ-ㅣ]/g, "");
  }

  // 종합 정규화
  static normalize(str) {
    if (!str) return "";
    return str.toLowerCase().trim();
  }

  // 검색용 정규화 (공백 + 특수문자 제거)
  static normalizeForSearch(str) {
    if (!str) return "";
    return this.removeSpaces(this.removeSpecialChars(str.toLowerCase().trim()));
  }
}
