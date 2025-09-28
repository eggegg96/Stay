import { useEffect, useRef } from "react";

export default function GoogleMap({
  query,
  lat,
  lng,
  level = 16,
  className = "w-full h-[420px] rounded-lg border",
  minHeight = "420px",
  type = null,
}) {
  const mapRef = useRef(null);
  const isInitialized = useRef(false);

  /**
   * 구글맵 API로 장소 검색
   */
  const searchWithGoogleAPI = async (searchQuery) => {
    if (!searchQuery || !window.google?.maps) return null;

    try {
      // Geocoding API 먼저 시도
      const geocoder = new window.google.maps.Geocoder();
      const geocodeResult = await new Promise((resolve) => {
        geocoder.geocode({ address: searchQuery }, (results, status) => {
          if (status === "OK" && results?.[0]) {
            const location = results[0].geometry.location;
            resolve({ lat: location.lat(), lng: location.lng() });
          } else {
            resolve(null);
          }
        });
      });

      if (geocodeResult) return geocodeResult;

      // Places API 시도
      if (window.google.maps.places) {
        const service = new window.google.maps.places.PlacesService(
          document.createElement("div")
        );
        const placesResult = await new Promise((resolve) => {
          service.textSearch({ query: searchQuery }, (results, status) => {
            if (
              status === window.google.maps.places.PlacesServiceStatus.OK &&
              results?.[0]
            ) {
              const location = results[0].geometry.location;
              resolve({ lat: location.lat(), lng: location.lng() });
            } else {
              resolve(null);
            }
          });
        });
        return placesResult;
      }

      return null;
    } catch (error) {
      console.error("구글맵 검색 오류:", error);
      return null;
    }
  };

  useEffect(() => {
    if (isInitialized.current) return;

    const initMap = async () => {
      if (!window.google?.maps || !mapRef.current) return;

      // 좌표 결정
      let centerLat, centerLng;

      if (typeof lat === "number" && typeof lng === "number") {
        // 1순위: 전달받은 좌표
        centerLat = lat;
        centerLng = lng;
      } else if (query) {
        // API 검색
        const searchResult = await searchWithGoogleAPI(query);
        if (searchResult) {
          centerLat = searchResult.lat;
          centerLng = searchResult.lng;
        } else {
          console.error(`"${query}" 검색 결과를 찾을 수 없습니다`);
          return; // 지도 생성 중단
        }
      } else {
        console.error("검색어나 좌표가 필요합니다");
        return; // 지도 생성 중단
      }

      // 지도 생성 - 깔끔한 옵션만
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: centerLat, lng: centerLng },
        zoom: level,
        mapTypeControl: false, // 지도/위성 토글 제거
        streetViewControl: false, // 스트리트뷰 제거
        fullscreenControl: false, // 전체화면 제거
        zoomControl: false, // 줌 컨트롤만 유지
        gestureHandling: "cooperative",
      });

      // 마커 추가
      new window.google.maps.Marker({
        position: { lat: centerLat, lng: centerLng },
        map: map,
        title: query || "위치",
      });

      isInitialized.current = true;
    };

    setTimeout(initMap, 100);
  }, [query, lat, lng, level, type]);

  return <div ref={mapRef} className={className} style={{ minHeight }} />;
}
