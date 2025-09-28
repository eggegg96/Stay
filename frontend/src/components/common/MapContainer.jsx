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
      googleLevel = 16;
      minHeight = "180px";
    } else {
      // 디테일 페이지: 더 자세한 범위로 보여주기
      kakaoLevel = 4; // 카카오맵은 동일
      googleLevel = 16; // 구글맵도 동일 (필요시 조정)
      minHeight = "420px";
    }

    return {
      isOverseas,
      kakaoLevel,
      googleLevel,
      minHeight,
      mapType: isOverseas ? "Google Maps" : "Kakao Map",
      accommodationId: accommodation?.id,
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

      {/* 개발용 표시 */}
      {process.env.NODE_ENV === "development" && (
        <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded pointer-events-none">
          {mapConfig.mapType} ({variant})
        </div>
      )}
    </div>
  );
}
