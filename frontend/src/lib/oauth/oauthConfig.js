/**
 * 소셜 로그인 설정
 *
 * 왜 필요한가?
 * - 구글, 네이버, 카카오마다 OAuth URL과 파라미터가 다름
 * - 설정을 한 곳에 모아두면 관리하기 쉬움
 *
 * OAuth 2.0 흐름:
 * 1. 사용자를 소셜 제공자의 인증 페이지로 보냄 (redirect_uri 포함)
 * 2. 사용자가 로그인 완료하면 redirect_uri로 돌아옴 (code 포함)
 * 3. code를 사용해서 access_token 받기
 * 4. access_token으로 사용자 정보 조회
 */

// 환경변수에서 값 가져오기
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const NAVER_CLIENT_ID = import.meta.env.VITE_NAVER_CLIENT_ID;
const KAKAO_CLIENT_ID = import.meta.env.VITE_KAKAO_CLIENT_ID;

// 개발 환경에서의 리다이렉트 URL
// 프로덕션에서는 실제 도메인으로 변경 필요
const REDIRECT_URI = `${window.location.origin}/oauth/callback`;

/**
 * 구글 OAuth 설정
 *
 * 설정 방법:
 * 1. https://console.cloud.google.com/ 접속
 * 2. 프로젝트 생성
 * 3. OAuth 동의 화면 설정
 * 4. 사용자 인증 정보 > OAuth 2.0 클라이언트 ID 생성
 * 5. 승인된 리디렉션 URI에 http://localhost:5173/oauth/callback 추가
 */
export const GOOGLE_AUTH_CONFIG = {
  authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
  params: {
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: "code",
    scope: "email profile", // 이메일, 프로필 정보 요청
    access_type: "offline",
    state: "google", // provider 정보를 state에 포함
  },
};

/**
 * 네이버 OAuth 설정
 *
 * 설정 방법:
 * 1. https://developers.naver.com/apps/ 접속
 * 2. 애플리케이션 등록
 * 3. 사용 API: 네이버 로그인
 * 4. Callback URL: http://localhost:5173/oauth/callback
 */
export const NAVER_AUTH_CONFIG = {
  authUrl: "https://nid.naver.com/oauth2.0/authorize",
  params: {
    client_id: NAVER_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: "code",
    state: "naver", // provider 정보를 state에 포함
  },
};

/**
 * 카카오 OAuth 설정
 *
 * 설정 방법:
 * 1. https://developers.kakao.com/ 접속
 * 2. 애플리케이션 추가
 * 3. 플랫폼 설정 > Web > 사이트 도메인 추가
 * 4. 제품 설정 > 카카오 로그인 > Redirect URI 등록
 */
export const KAKAO_AUTH_CONFIG = {
  authUrl: "https://kauth.kakao.com/oauth/authorize",
  params: {
    client_id: KAKAO_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: "code",
    state: "kakao", // provider 정보를 state에 포함
  },
};

/**
 * OAuth URL 생성 헬퍼
 */
export const buildAuthUrl = (config) => {
  const params = new URLSearchParams(config.params);
  return `${config.authUrl}?${params.toString()}`;
};
