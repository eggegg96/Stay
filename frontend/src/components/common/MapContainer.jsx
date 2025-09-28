import { useMemo } from "react";
import KakaoMap from "./KakaoMap";
import GoogleMap from "./GoogleMap";

/**
 * 지역에 따라 카카오맵/구글맵을 자동 선택하는 통합 컴포넌트
 * 페이지별 다른 높이와 레벨 지원
 */
export default function MapContainer({
  accommodation,
  query,
  lat,
  lng,
  className = "w-full h-full", // 기본값 변경
  variant = "detail", // "detail" | "result" - 페이지 타입
}) {
  // 모든 계산을 useMemo로 메모이제이션
  const mapConfig = useMemo(() => {
    const isOverseas = accommodation?.type === "overseas";

    // variant에 따른 레벨 설정
    let kakaoLevel, googleLevel, minHeight;

    if (variant === "result") {
      // 결과 페이지: 더 넓은 범위로 보여주기
      kakaoLevel = 4;
      googleLevel = 14; // 더 넓은 범위
      minHeight = "180px";
    } else {
      // 디테일 페이지: 더 자세한 범위로 보여주기
      kakaoLevel = 4;
      googleLevel = 16; // 더 상세한 범위
      minHeight = "420px";
    }

    return {
      isOverseas,
      kakaoLevel,
      googleLevel,
      minHeight,
      mapType: isOverseas ? "Google Maps" : "Kakao Map",
      accommodationId: accommodation?.id,
      accommodationType: accommodation?.type, // 타입 정보 추가
    };
  }, [accommodation?.type, accommodation?.id, variant]);

  const mapKey = `${mapConfig.isOverseas ? "google" : "kakao"}-${
    mapConfig.accommodationId
  }-${variant}`;

  return (
    <div className={`relative ${className}`}>
      {mapConfig.isOverseas ? (
        <GoogleMap
          key={mapKey}
          query={query}
          lat={lat}
          lng={lng}
          level={mapConfig.googleLevel}
          type={accommodation?.type} // 숙소 타입 직접 전달
          className="w-full h-full"
          minHeight={mapConfig.minHeight}
        />
      ) : (
        <KakaoMap
          key={mapKey}
          query={query}
          lat={lat}
          lng={lng}
          level={mapConfig.kakaoLevel}
          className="w-full h-full"
        />
      )}
    </div>
  );
}
