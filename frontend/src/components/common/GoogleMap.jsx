import { useEffect, useRef, useState } from "react";

export default function GoogleMap({
  query,
  lat,
  lng,
  level = 16,
  className = "w-full h-[420px] rounded-lg border",
  minHeight = "420px", // 새로운 prop 추가
}) {
  const mapRef = useRef(null);
  const isInitialized = useRef(false);
  const [mapStatus, setMapStatus] = useState("initializing");

  useEffect(() => {
    if (isInitialized.current) return;

    const initializeMap = async () => {
      try {
        // 1. API 확인
        if (!window.google?.maps) {
          console.error("Google Maps API not loaded");
          setMapStatus("api-not-loaded");
          return;
        }

        // 2. DOM 요소 확인
        if (!mapRef.current) {
          console.error("Map container not found");
          setMapStatus("container-not-found");
          return;
        }

        // 3. 좌표 검증 및 설정
        const centerLat =
          typeof lat === "number" && !isNaN(lat) ? lat : 35.6762;
        const centerLng =
          typeof lng === "number" && !isNaN(lng) ? lng : 139.6503;
        const center = { lat: centerLat, lng: centerLng };

        setMapStatus("creating-map");

        // 4. 지도 생성 (명시적 옵션 설정)
        const map = new window.google.maps.Map(mapRef.current, {
          center: center,
          zoom: level,
          mapTypeId: "roadmap",
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
          zoomControl: true,
          gestureHandling: "cooperative",
          backgroundColor: "#e5e7eb", // 로딩 중 배경색
        });

        // 5. 지도 로드 완료 대기
        google.maps.event.addListenerOnce(map, "idle", () => {
          setMapStatus("map-loaded");

          // 6. 마커 추가
          try {
            const marker = new window.google.maps.Marker({
              position: center,
              map: map,
              title: query || "숙소 위치",
              optimized: false, // 렌더링 문제 방지
            });
            setMapStatus("marker-added");
          } catch (markerError) {
            console.error("마커 생성 오류:", markerError);
            setMapStatus("marker-error");
          }
        });

        // 7. 지도 오류 처리
        google.maps.event.addListener(map, "tilesloaded", () => {});

        isInitialized.current = true;
      } catch (error) {
        console.error("구글맵 초기화 오류:", error);
        setMapStatus("initialization-error");
      }
    };

    // 지연 실행으로 DOM 준비 보장
    const timer = setTimeout(initializeMap, 100);
    return () => clearTimeout(timer);
  }, [query, lat, lng, level]);

  const getStatusMessage = () => {
    switch (mapStatus) {
      case "initializing":
        return "지도 초기화 중...";
      case "api-not-loaded":
        return "Google Maps API 로드 실패";
      case "container-not-found":
        return "지도 컨테이너 오류";
      case "creating-map":
        return "지도 생성 중...";
      case "map-loaded":
        return "지도 로드 완료";
      case "marker-added":
        return "위치 표시 완료";
      case "marker-error":
        return "위치 표시 오류";
      case "initialization-error":
        return "초기화 오류";
      default:
        return "준비 중...";
    }
  };

  return (
    <div className="relative">
      <div
        ref={mapRef}
        className={className}
        data-testid="google-map"
        style={{
          minHeight: minHeight, // prop으로 받은 값 사용
          backgroundColor: "#e5e7eb",
        }}
      />

      {/* 상태 표시 */}
      {process.env.NODE_ENV === "development" && (
        <div className="absolute top-2 right-2 bg-blue-600/90 text-white text-xs px-2 py-1 rounded pointer-events-none">
          <div>Google Maps</div>
          <div className="text-xs opacity-80">{getStatusMessage()}</div>
        </div>
      )}

      {/* 로딩 오버레이 */}
      {mapStatus !== "marker-added" && mapStatus !== "map-loaded" && (
        <div className="absolute inset-0 bg-gray-100/80 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">{getStatusMessage()}</p>
          </div>
        </div>
      )}
    </div>
  );
}
