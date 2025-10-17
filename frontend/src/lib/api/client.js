import axios from "axios";
import { API_TIMEOUT } from "@/constants";

/**
 * Axios 인스턴스 생성
 *
 * HttpOnly 쿠키 방식:
 * - JWT 토큰이 HttpOnly 쿠키로 저장됨 (백엔드에서 설정)
 * - 브라우저가 자동으로 쿠키를 관리하고 전송
 * - 프론트엔드는 토큰을 직접 저장/조회하지 않음
 * - XSS 공격으로부터 안전함 (JavaScript로 토큰 접근 불가)
 *
 * 왜 필요한가?
 * - 모든 API 요청에 공통 설정(baseURL, timeout, headers)을 한 번만 정의
 * - withCredentials: true 설정으로 쿠키 자동 전송
 * - 인터셉터로 401 에러 등 공통 에러 처리
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
  withCredentials: true,
  timeout: API_TIMEOUT.DEFAULT,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * 요청 인터셉터
 *
 * HttpOnly 쿠키 방식에서는:
 * - Authorization 헤더에 토큰을 직접 넣지 않음
 * - 브라우저가 자동으로 쿠키를 요청에 포함
 * - 백엔드의 JwtAuthenticationFilter가 쿠키에서 토큰 추출
 *
 * 기존 localStorage 방식과의 차이:
 * - localStorage: 프론트엔드가 직접 토큰을 꺼내서 헤더에 추가
 * - HttpOnly 쿠키: 브라우저가 자동으로 처리 (더 안전)
 */
apiClient.interceptors.request.use(
  (config) => {
    // HttpOnly 쿠키는 브라우저가 자동으로 전송하므로
    // 여기서 토큰을 추가할 필요가 없음

    // 디버깅용 로그 (개발 환경에서만)
    if (import.meta.env.DEV) {
      console.log(
        `[API Request] ${config.method?.toUpperCase()} ${config.url}`
      );
    }

    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

/**
 * 응답 인터셉터
 *
 * 모든 API 응답을 받은 직후 실행됨
 *
 * 401 에러 처리:
 * - Access Token 만료 시 자동으로 Refresh Token으로 재발급 시도
 * - Refresh Token도 HttpOnly 쿠키로 관리됨
 * - 재발급 성공 시 원래 요청 재시도
 * - 재발급 실패 시 로그인 페이지로 이동
 */
let isRefreshing = false; // 토큰 재발급 중인지 플래그
let failedQueue = []; // 401로 실패한 요청들을 저장할 큐

/**
 * 실패한 요청들을 다시 실행하거나 거부
 */
const processQueue = (error) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });

  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => {
    // 성공 응답은 그대로 반환
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    /**
     * 401 에러 처리 (인증 실패)
     *
     * 시나리오:
     * 1. API 요청 → 401 에러 (Access Token 만료)
     * 2. Refresh Token으로 새 Access Token 발급 시도
     * 3-1. 성공: 원래 요청 재시도
     * 3-2. 실패: 로그인 페이지로 이동
     */
    if (error.response?.status === 401 && !originalRequest._retry) {
      // 무한 루프 방지
      if (isRefreshing) {
        // 이미 토큰 재발급 중이면 대기열에 추가
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Refresh Token API 호출
        // Refresh Token도 HttpOnly 쿠키로 전송되므로 별도 파라미터 불필요
        await apiClient.post("/auth/refresh");

        // 대기 중인 요청들 재시도
        processQueue(null);

        // 원래 요청 재시도
        // 새로운 Access Token이 쿠키에 설정되었으므로 자동으로 전송됨
        return apiClient(originalRequest);
      } catch (refreshError) {
        // 토큰 재발급 실패 -> 로그아웃 처리
        processQueue(refreshError);

        // 로그인 페이지로 리다이렉트
        console.error("Refresh Token 만료 - 로그인 페이지로 이동");
        window.location.href = "/login";

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // 401 외 에러는 그대로 반환
    return Promise.reject(error);
  }
);

export default apiClient;
