import { useEffect, useRef } from "react";

/**
 * KakaoMap (숙소명 검색 -> 마커만 표시)
 */
export default function KakaoMap({
  query,
  lat,
  lng,
  level = 3,
  className = "w-full h-[420px] rounded-lg border",
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (!window.kakao?.maps) return;

    window.kakao.maps.load(() => {
      const Map = window.kakao.maps.Map;
      const LatLng = window.kakao.maps.LatLng;
      const Marker = window.kakao.maps.Marker;

      // 1) 지도 인스턴스
      const ensureMap = (center) => {
        if (!mapInstanceRef.current) {
          mapInstanceRef.current = new Map(mapRef.current, { center, level });
        } else {
          mapInstanceRef.current.setLevel(level);
          mapInstanceRef.current.setCenter(center);
        }
        return mapInstanceRef.current;
      };

      // 2) 마커 세팅
      const setMarker = (map, center) => {
        if (!markerRef.current) {
          markerRef.current = new Marker({ position: center });
          markerRef.current.setMap(map);
        } else {
          markerRef.current.setPosition(center);
          markerRef.current.setMap(map);
        }
      };

      // 3) 검색 → 실패 시 fallback
      const useFallback = () => {
        if (typeof lat === "number" && typeof lng === "number") {
          const center = new LatLng(lat, lng);
          const map = ensureMap(center);
          setMarker(map, center);
        }
      };

      if (query && window.kakao.maps.services?.Places) {
        const ps = new window.kakao.maps.services.Places();
        ps.keywordSearch(query, (data, status) => {
          if (status === window.kakao.maps.services.Status.OK && data.length) {
            const place = data[0];
            const center = new LatLng(Number(place.y), Number(place.x));
            const map = ensureMap(center);
            setMarker(map, center);
          } else {
            useFallback();
          }
        });
      } else {
        useFallback();
      }
    });
  }, [query, lat, lng, level]);

  return <div ref={mapRef} className={className} />;
}
