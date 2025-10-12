package com.stay.domain.auth.controller;

import com.stay.domain.auth.dto.LoginRequest;
import com.stay.domain.auth.dto.LoginResponse;
import com.stay.domain.auth.service.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * 인증 관련 API 컨트롤러
 *
 * 왜 필요한가?
 * - 프론트엔드에서 로그인/로그아웃 요청을 받아 처리
 * - JWT 토큰을 HttpOnly 쿠키로 발급
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * 로그인 API
     *
     * @param request 이메일, 비밀번호
     * @param response HttpServletResponse (쿠키 설정용)
     * @return 로그인 성공 정보
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @RequestBody LoginRequest request,
            HttpServletResponse response
    ) {
        // TODO: 실제 DB 연동은 나중에
        // 지금은 테스트용 하드코딩

        if ("test@test.com".equals(request.getEmail()) &&
                "1234".equals(request.getPassword())) {

            // JWT 토큰 생성 (JwtUtil 사용)
            String token = "임시토큰"; // 나중에 JwtUtil로 생성

            // HttpOnly 쿠키 생성
            Cookie cookie = new Cookie("token", token);
            cookie.setHttpOnly(true);  // JavaScript 접근 차단
            cookie.setSecure(false);   // 개발 환경 (배포 시 true)
            cookie.setPath("/");       // 모든 경로에서 쿠키 전송
            cookie.setMaxAge(7 * 24 * 60 * 60); // 7일

            response.addCookie(cookie);

            LoginResponse loginResponse = LoginResponse.builder()
                    .success(true)
                    .message("로그인 성공")
                    .email(request.getEmail())
                    .build();

            return ResponseEntity.ok(loginResponse);
        }

        // 로그인 실패
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(LoginResponse.builder()
                        .success(false)
                        .message("이메일 또는 비밀번호가 일치하지 않습니다")
                        .build());
    }

    /**
     * 로그아웃 API
     *
     * @param response HttpServletResponse (쿠키 삭제용)
     * @return 로그아웃 성공 메시지
     */
    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletResponse response) {
        // 쿠키 삭제 (MaxAge를 0으로 설정)
        Cookie cookie = new Cookie("token", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(0); // 즉시 삭제

        response.addCookie(cookie);

        return ResponseEntity.ok("로그아웃 성공");
    }
}