import axios from "axios";
import { API_TIMEOUT } from "@/constants";
import {
  getAccessToken,
  setTokens,
  clearTokens,
} from "@/lib/utils/tokenStorage";

/**
 * Axios 인스턴스 생성
 *
 * 왜 필요한가?
 * - 매번 axios.get, axios.post 할 때마다 baseURL 적는 건 비효율적
 * - 공통 설정(baseURL, timeout, headers)을 한 번만 정의
 * - 인터셉터로 모든 요청에 자동으로 토큰 추가 가능
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
  timeout: API_TIMEOUT.DEFAULT,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * 요청 인터셉터
 *
 * 모든 API 요청 직전에 실행됨
 *
 * 왜 필요한가?
 * - 로그인이 필요한 API마다 일일이 토큰 넣는 건 번거로움
 * - 인터셉터가 자동으로 모든 요청에 토큰 추가
 * - DRY 원칙! (Don't Repeat Yourself)
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();

    // 토큰이 있으면 Authorization 헤더에 추가
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // 요청 설정 중 에러 발생
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

/**
 * 응답 인터셉터
 *
 * 모든 API 응답을 받은 직후 실행됨
 *
 * 왜 필요한가?
 * - 401 에러(인증 실패) 발생 시 자동으로 토큰 재발급 시도
 * - 토큰 만료 시 사용자가 수동으로 다시 로그인 안 해도 됨
 * - 자동 리프레시 로직 구현
 */
let isRefreshing = false; // 토큰 재발급 중인지 플래그
let failedQueue = []; // 401로 실패한 요청들을 저장할 큐

/**
 * 실패한 요청들을 다시 실행
 */
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
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
     * 1. API 요청 -> 401 에러 (토큰 만료)
     * 2. Refresh Token으로 새 Access Token 발급 시도
     * 3-1. 성공: 새 토큰으로 원래 요청 재시도
     * 3-2. 실패: 로그인 페이지로 이동
     */
    if (error.response?.status === 401 && !originalRequest._retry) {
      // 무한 루프 방지
      if (isRefreshing) {
        // 이미 토큰 재발급 중이면 대기열에 추가
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // 토큰 재발급 API 호출 (나중에 authApi.js에서 구현)
        const { refreshToken } = await import("@/lib/utils/tokenStorage").then(
          (module) => ({ refreshToken: module.getRefreshToken() })
        );

        if (!refreshToken) {
          throw new Error("리프레시 토큰이 없습니다.");
        }

        // 토큰 재발급 요청
        const response = await axios.post(
          `${apiClient.defaults.baseURL}/auth/refresh`,
          { refreshToken }
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        // 새 토큰 저장
        setTokens(accessToken, newRefreshToken);

        // 대기 중인 요청들 재시도
        processQueue(null, accessToken);

        // 원래 요청 재시도
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // 토큰 재발급 실패 -> 로그아웃 처리
        processQueue(refreshError, null);
        clearTokens();

        // 로그인 페이지로 리다이렉트
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
