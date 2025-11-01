package com.stay.domain.auth.service;

import com.stay.config.OAuthProperties;
import com.stay.domain.auth.dto.*;
import com.stay.domain.member.dto.SocialLoginRequest;
import com.stay.domain.member.entity.SocialProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.client.WebClient;

/**
 * OAuth 서비스
 *
 * 왜 필요한가?
 * - 소셜 제공자(구글, 네이버, 카카오)와 통신
 * - code → access_token → 사용자 정보 흐름 처리
 * - AuthService는 이 서비스를 사용해서 간단하게 OAuth 처리
 *
 * 책임 분리:
 * - OAuthService: 소셜 제공자와 통신 (외부 API 호출)
 * - AuthService: 인증 비즈니스 로직 (JWT 발급 등)
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class OAuthService {

    private final OAuthProperties oauthProperties;
    private final WebClient webClient;

    /**
     * OAuth 로그인 처리 (code → 사용자 정보)
     *
     * @param provider 소셜 제공자 (GOOGLE, NAVER, KAKAO)
     * @param code OAuth authorization code
     * @return 사용자 정보를 담은 SocialLoginRequest
     *
     * 흐름:
     * 1. code로 access_token 받기
     * 2. access_token으로 사용자 정보 받기
     * 3. SocialLoginRequest로 변환 (MemberService에서 사용)
     */
    public SocialLoginRequest processOAuthLogin(String provider, String code) {
        log.info("OAuth 로그인 처리 시작 - provider: {}", provider);

        // 1. access_token 발급
        String accessToken = getAccessToken(provider, code);
        log.info("Access Token 발급 완료 - provider: {}", provider);

        // 2. 사용자 정보 조회
        SocialLoginRequest userInfo = getUserInfo(provider, accessToken);
        log.info("사용자 정보 조회 완료 - provider: {}, email: {}",
                provider, userInfo.email());

        return userInfo;
    }

    /**
     * OAuth Access Token 발급
     *
     * @param provider 소셜 제공자
     * @param code authorization code
     * @return access_token
     */
    private String getAccessToken(String provider, String code) {
        OAuthProperties.Provider config = oauthProperties.getProvider(provider);

        // 요청 파라미터 구성
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", config.getClientId());
        params.add("client_secret", config.getClientSecret());
        params.add("code", code);
        params.add("redirect_uri", config.getRedirectUri());

        try {
            log.info("========================================");
            log.info("구글 토큰 요청 정보:");
            log.info("Token URI: {}", config.getTokenUri());
            log.info("Client ID: {}", config.getClientId());

            if (config.getClientSecret() == null || config.getClientSecret().isBlank()) {
                log.error("Client Secret이 설정되지 않았습니다!");
                throw new IllegalStateException("Client Secret이 설정되지 않았습니다.");
            }
            log.info("Client Secret: {}... (길이: {})",
                    config.getClientSecret().substring(0, Math.min(10, config.getClientSecret().length())),
                    config.getClientSecret().length());

            log.info("Redirect URI: {}", config.getRedirectUri());
            log.info("Code: {}...", code.substring(0, Math.min(30, code.length())));
            log.info("========================================");

            // 핵심 수정: Content-Type을 application/x-www-form-urlencoded로 명시
            OAuthTokenResponse response = webClient.post()
                    .uri(config.getTokenUri())
                    .contentType(org.springframework.http.MediaType.APPLICATION_FORM_URLENCODED)
                    .bodyValue(params)
                    .retrieve()
                    .onStatus(
                            status -> status.is4xxClientError() || status.is5xxServerError(),
                            clientResponse -> clientResponse.bodyToMono(String.class)
                                    .doOnNext(errorBody -> {
                                        log.error("========================================");
                                        log.error("구글 에러 응답:");
                                        log.error("{}", errorBody);
                                        log.error("========================================");
                                    })
                                    .then(clientResponse.createException())
                    )
                    .bodyToMono(OAuthTokenResponse.class)
                    .block();

            if (response == null || response.access_token() == null) {
                throw new IllegalStateException("토큰 발급 실패: 응답이 null입니다.");
            }

            log.info("토큰 발급 성공!");
            return response.access_token();

        } catch (Exception e) {
            log.error("========================================");
            log.error("Access Token 발급 실패");
            log.error("Provider: {}", provider);
            log.error("Error: {}", e.getMessage(), e);
            log.error("========================================");
            throw new IllegalStateException("OAuth 토큰 발급 실패: " + e.getMessage());
        }
    }
    /**
     * 사용자 정보 조회
     *
     * @param provider 소셜 제공자
     * @param accessToken OAuth access token
     * @return SocialLoginRequest (사용자 정보)
     */
    private SocialLoginRequest getUserInfo(String provider, String accessToken) {
        OAuthProperties.Provider config = oauthProperties.getProvider(provider);

        try {
            return switch (provider.toUpperCase()) {
                case "GOOGLE" -> getGoogleUserInfo(config, accessToken);
                case "NAVER" -> getNaverUserInfo(config, accessToken);
                case "KAKAO" -> getKakaoUserInfo(config, accessToken);
                default -> throw new IllegalArgumentException("지원하지 않는 제공자: " + provider);
            };

        } catch (Exception e) {
            log.error("사용자 정보 조회 실패 - provider: {}", provider, e);
            throw new IllegalStateException("사용자 정보 조회 실패: " + e.getMessage());
        }
    }

    /**
     * 구글 사용자 정보 조회
     */
    private SocialLoginRequest getGoogleUserInfo(
            OAuthProperties.Provider config,
            String accessToken
    ) {
        GoogleUserInfo userInfo = webClient.get()
                .uri(config.getUserInfoUri())
                .header("Authorization", "Bearer " + accessToken)
                .retrieve()
                .bodyToMono(GoogleUserInfo.class)
                .block();

        if (userInfo == null) {
            throw new IllegalStateException("구글 사용자 정보 조회 실패");
        }

        return new SocialLoginRequest(
                SocialProvider.GOOGLE,  // enum 직접 전달
                userInfo.id(),
                userInfo.email(),
                userInfo.name(),
                userInfo.email(),
                userInfo.picture(),
                null
        );
    }

    /**
     * 네이버 사용자 정보 조회
     */
    private SocialLoginRequest getNaverUserInfo(
            OAuthProperties.Provider config,
            String accessToken
    ) {
        NaverUserInfoResponse response = webClient.get()
                .uri(config.getUserInfoUri())
                .header("Authorization", "Bearer " + accessToken)
                .retrieve()
                .bodyToMono(NaverUserInfoResponse.class)
                .block();

        if (response == null || response.response() == null) {
            throw new IllegalStateException("네이버 사용자 정보 조회 실패");
        }

        NaverUserInfo userInfo = response.response();
        return new SocialLoginRequest(
                SocialProvider.NAVER,  // enum 직접 전달
                userInfo.id(),
                userInfo.email(),
                userInfo.name(),
                userInfo.email(),
                userInfo.profile_image(),
                null
        );
    }

    /**
     * 카카오 사용자 정보 조회
     */
    private SocialLoginRequest getKakaoUserInfo(
            OAuthProperties.Provider config,
            String accessToken
    ) {
        KakaoUserInfo userInfo = webClient.get()
                .uri(config.getUserInfoUri())
                .header("Authorization", "Bearer " + accessToken)
                .retrieve()
                .bodyToMono(KakaoUserInfo.class)
                .block();

        if (userInfo == null || userInfo.kakao_account() == null) {
            throw new IllegalStateException("카카오 사용자 정보 조회 실패");
        }

        String email = userInfo.kakao_account().email();
        String name = userInfo.kakao_account().profile().nickname();
        String profileImage = userInfo.kakao_account().profile().profile_image_url();

        // 카카오는 이메일이 선택 항목이라 없을 수 있음
        if (email == null || email.isBlank()) {
            email = "kakao_" + userInfo.id() + "@kakao.temp";
        }

        return new SocialLoginRequest(
                SocialProvider.KAKAO,  // enum 직접 전달
                userInfo.id().toString(),
                email,
                name,
                userInfo.kakao_account().email(),
                profileImage,
                null

        );
    }
}