package com.example.Main.domain.Member.controller;

import com.example.Main.domain.Member.dto.MemberDTO;
import com.example.Main.domain.Member.entity.Member;
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

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/members")
public class ApiV1MemberController {
    private final MemberService memberService;
    private final JwtProvider jwtProvider;
    private final String loginToken = "loginToken"; // 쿠키에 저장될 로그인 토큰 이름

    @PostMapping("/join")
    public RsData join(@Valid @RequestBody MemberCreate memberCreate) {
        MemberDTO memberDTO = this.memberService.join(memberCreate.getUsername(), memberCreate.getPassword(), memberCreate.getBirthDate(), memberCreate.getGender());

        if (memberDTO == null) {
            return RsData.of("400", "이미 존재하는 사용자입니다.");
        }
        return RsData.of("200", "회원가입 성공", memberDTO);
    }

    @PostMapping("/login")
    public RsData login (@Valid @RequestBody MemberRequest memberRequest, HttpServletResponse httpServletResponse) {
        Member member = this.memberService.getMemberByName(memberRequest.getUsername());
        if (member == null) {
            return RsData.of("400", "존재하지 않는 사용자 입니다.");
        }
        String jwtToken = this.jwtProvider.genToken(member, 60 * 60 * 24);  // 토큰 지속 시간: 24h

        httpServletResponse.addCookie(new Cookie(loginToken, jwtToken));

        return RsData.of("200", "로그인 성공", jwtToken);
    }

    @GetMapping("/logout")
    public RsData logout(HttpServletResponse res) {
        Cookie cookie = new Cookie(loginToken, null);
        cookie.setMaxAge(0);
        cookie.setPath("/");
        res.addCookie(cookie);
        return RsData.of("200", "로그아웃 성공");
    }

    @GetMapping("/me")
    public RsData getMe (HttpServletRequest req) {
        Cookie[] cookies = req.getCookies();
        String accessToken = "";
        for (Cookie cookie : cookies) {
            if (loginToken.equals(cookie.getName())) {
                accessToken = cookie.getValue();
            }
        }

        boolean checkedToken = jwtProvider.verify(accessToken);

        System.out.println(checkedToken);
        if (!checkedToken) {
            return RsData.of("400", "유효성 검증 실패");
        }

        Map<String, Object> claims = jwtProvider.getClaims(accessToken);
        claims.get("id");
        claims.get("username");

        return RsData.of("200", "사용자 정보 : " + (String) claims.get("username"));
    }
}
