package com.example.Main.domain.Member.controller;

import com.example.Main.domain.Member.dto.MemberDTO;
import com.example.Main.domain.Member.entity.Member;
import com.example.Main.domain.Member.enums.MemberGender;
import com.example.Main.domain.Member.request.MemberCreate;
import com.example.Main.domain.Member.request.MemberRequest;
import com.example.Main.domain.Member.service.MemberService;
import com.example.Main.global.Jwt.JwtProvider;
import com.example.Main.global.RsData.RsData;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/members")
public class ApiV1MemberController {
    private final MemberService memberService;
    private final JwtProvider jwtProvider;

    @PostMapping("/join")
    public RsData join(@Valid @RequestBody MemberCreate memberCreate) {
        String username = memberCreate.getUsername();
        String password = memberCreate.getPassword();
        LocalDateTime birthDate = memberCreate.getBirthDate();
        MemberGender gender = memberCreate.getGender();

        MemberDTO memberDTO = this.memberService.join(username, password, birthDate, gender);

        if (memberDTO == null) {
            return RsData.of("400", "이미 존재하는 사용자입니다.");
        }
        return RsData.of("200", "회원가입 성공", memberDTO);
    }

    @PostMapping("/login")
    public RsData login (@Valid @RequestBody MemberRequest memberRequest, HttpServletResponse res) {
        Member member = this.memberService.getMemberByName(memberRequest.getUsername());

        String accessToken = jwtProvider.genAccessToken(member);
        Cookie accessTokenCookie  = new Cookie("accessToken", accessToken);
        accessTokenCookie.setHttpOnly(true);
        accessTokenCookie.setSecure(true);
        accessTokenCookie.setPath("/");
        accessTokenCookie.setMaxAge(60 * 60 * 24);   // 로그인 지속 시간: 24h
        res.addCookie(accessTokenCookie);


        String refreshToken = member.getRefreshToken();
        Cookie refreshTokenCookie  = new Cookie("refreshToken", refreshToken);
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setSecure(true);
        refreshTokenCookie.setPath("/");
        refreshTokenCookie.setMaxAge(60 * 60);
        res.addCookie(refreshTokenCookie);

        return RsData.of("200", "토큰 발급 성공: " + accessToken , new MemberDTO(member));
    }

    @GetMapping("/logout")
    public RsData logout(HttpServletResponse res) {
        Cookie accessTokenCookie = new Cookie("accessToken", null);
        accessTokenCookie.setPath("/");
        accessTokenCookie.setMaxAge(0);
        res.addCookie(accessTokenCookie);

        Cookie refreshTokenCookie = new Cookie("refreshToken", null);
        refreshTokenCookie.setPath("/");
        refreshTokenCookie.setMaxAge(0);
        res.addCookie(refreshTokenCookie);

        return RsData.of("200", "로그아웃 성공");
    }

    @GetMapping("/me")  // 로그인된 사용자 정보 확인하기
    public RsData getMe (HttpServletRequest req) {
        Cookie[] cookies = req.getCookies();
        String accessToken = "";
        for (Cookie cookie : cookies) {
            if ("accessToken".equals(cookie.getName())) {
                accessToken = cookie.getValue();
            }
        }

        if (accessToken.equals("")) {
            return RsData.of("400", "유효성 검증 실패");
        }

        Map<String, Object> claims =  jwtProvider.getClaims(accessToken);
        String username = (String) claims.get("username");
        Member member = this.memberService.getMemberByName(username);

        return RsData.of("200", "내 회원정보", new MemberDTO(member));
    }
}
