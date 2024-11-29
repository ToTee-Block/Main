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
        String accessToken = _getCookie("accessToken");
        if (accessToken.isBlank()) {
            filterChain.doFilter(request, response);  // 토큰이 없는 경우 그대로 요청을 진행
            return;
        }

        // 토큰 검증
        if (!memberService.validateToken(accessToken)) {
            String refreshToken = _getCookie("refreshToken");
            if (refreshToken.isBlank() || !memberService.validateToken(refreshToken)) {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "로그인이 필요합니다.");
                return;
            }

            // RefreshToken으로 새 AccessToken 발급
            RsData<String> rs = memberService.refreshAccessToken(refreshToken);
            _addHeaderCookie("accessToken", rs.getData());
            accessToken = rs.getData();
        }

        // AccessToken으로 사용자 정보 가져오기
        SecurityMember securityMember = memberService.getUserFromAccessToken(accessToken);

        // 인가 처리
        SecurityContextHolder.getContext().setAuthentication(securityMember.genAuthentication());

        filterChain.doFilter(request, response);
    }

    private String _getCookie(String name) {
        Cookie[] cookies = req.getCookies();
        if(cookies==null){
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