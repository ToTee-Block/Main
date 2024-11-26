package com.example.Main.domain.Mentor.controller;

import com.example.Main.domain.Member.entity.Member;
import com.example.Main.domain.Member.service.MemberService;
import com.example.Main.domain.Mentor.dto.MentorDTO;
import com.example.Main.domain.Mentor.request.MentorRegistrationRequest;
import com.example.Main.domain.Mentor.service.MentorService;
import com.example.Main.global.Jwt.JwtProvider;
import com.example.Main.global.RsData.RsData;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/mentors")
public class ApiV1MentorController {
    private final MentorService mentorService;
    private final JwtProvider jwtProvider;
    private final MemberService memberService;

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/registration")
    public RsData<?> mentorRegistration(@Valid @RequestBody MentorRegistrationRequest mentorRegistrationRequest,
                                        HttpServletRequest req) {
        Cookie[] cookies = req.getCookies();
        String accessToken = "";
        if (cookies == null) {
            return RsData.of("400", "유효성 검증 실패");
        }

        for (Cookie cookie : cookies) {
            if ("accessToken".equals(cookie.getName())) {
                accessToken = cookie.getValue();
            }
        }

        Map<String, Object> claims =  jwtProvider.getClaims(accessToken);
        String email = (String) claims.get("email");
        Member member = this.memberService.getMemberByEmail(email);
        if (member == null) {
            return RsData.of("400", "유효성 검증 실패");
        }

        MentorDTO mentorDTO = this.mentorService.mentorRegistration(
                member, mentorRegistrationRequest.getOneLineBio(),
                mentorRegistrationRequest.getBio(), mentorRegistrationRequest.getPortfolio()
        );
        return RsData.of("200", "멘토 등록 신청 성공", mentorDTO);
    }
}
