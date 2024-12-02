package com.example.Main.global.Security;

import com.example.Main.domain.Member.service.MemberService;
import com.example.Main.global.RsData.RsData;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.util.Arrays;

@Component
@RequiredArgsConstructor
public class JwtAuthorizationFilter extends OncePerRequestFilter {
    private final HttpServletRequest req;
    private final HttpServletResponse resp;
    private final MemberService memberService;
    @Override
    @SneakyThrows
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) {
        // 회원가입, 로그인, 로그아웃 요청에 접근할 때는 토큰인증처리 불필요
        if (request.getRequestURI().equals("/api/v1/members/join")
                || request.getRequestURI().equals("/api/v1/members/login")
                || request.getRequestURI().equals("/api/v1/members/logout")
                || request.getRequestURI().equals("/api/v1/mentors/profile/**"))
        {
            filterChain.doFilter(request, response);
            return;
        }

        String accessToken = _getCookie("accessToken");
        // accessToken 검증 or refreshToken 발급
        if (!accessToken.isBlank()) {
            // 토큰 유효기간 검증
            if (!memberService.validateToken(accessToken)) {
                String refreshToken = _getCookie("refreshToken");

                RsData<String> rs = memberService.refreshAccessToken(refreshToken);
                _addHeaderCookie("accessToken", rs.getData());
            }

            // 토큰으로부터 사용자 인증 정보 추출
            Authentication authentication = memberService.getUserFromAccessToken(accessToken)
                                                         .genAuthentication();
            // 시큐리티에 인증 정보 등록
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        filterChain.doFilter(request, response);
    }

    private String _getCookie(String name) {
        Cookie[] cookies = req.getCookies();

        if (cookies == null) {
            return "";
        }

        return Arrays.stream(cookies)
                .filter(cookie -> cookie.getName().equals(name))
                .findFirst()
                .map(Cookie::getValue)
                .orElse("");
    }

    private void _addHeaderCookie(String tokenName, String token) {
        ResponseCookie cookie = ResponseCookie.from(tokenName, token)
                .path("/")
                .sameSite("None")
                .secure(true)
                .httpOnly(true)
                .build();

        resp.addHeader("Set-Cookie", cookie.toString());
    }
}