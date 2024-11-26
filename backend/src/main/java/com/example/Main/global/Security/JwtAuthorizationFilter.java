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
        if (request.getRequestURI().contains("/api/v1/") || request.getRequestURI().equals("/api/v1/members/login") || request.getRequestURI().equals("/api/v1/members/logout")) {
            filterChain.doFilter(request, response);
            return;
        }

        String accessToken = _getCookie("accessToken");

        // accessToken null 체크
        if (accessToken == null || accessToken.isBlank()) {
            // 토큰이 없으면 그냥 다음 필터로 진행
            filterChain.doFilter(request, response);
            return;
        }

        // accessToken 검증 or refreshToken 발급
        if (!memberService.validateToken(accessToken)) {
            String refreshToken = _getCookie("refreshToken");

            // refreshToken null 체크
            if (refreshToken == null || refreshToken.isBlank()) {
                // refreshToken도 없으면 다음 필터로 진행
                filterChain.doFilter(request, response);
                return;
            }

            RsData<String> rs = memberService.refreshAccessToken(refreshToken);
            if (rs != null && rs.getData() != null) {
                _addHeaderCookie("accessToken", rs.getData());
                accessToken = rs.getData(); // 새로운 accessToken으로 업데이트
            } else {
                // refreshToken으로 갱신 실패 시 로그아웃 처리 등 추가 로직 필요
                filterChain.doFilter(request, response);
                return;
            }
        }

        // securityUser 가져오기
        SecurityMember securityMember = memberService.getUserFromAccessToken(accessToken);
        if (securityMember != null) {
            // 인가 처리
            SecurityContextHolder.getContext().setAuthentication(securityMember.genAuthentication());
        }

        filterChain.doFilter(request, response);
    }
    private String _getCookie(String name) {
        Cookie[] cookies = req.getCookies();

        if (cookies == null) {
            return null;
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