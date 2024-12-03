package com.example.Main.domain.Mentor.controller;

import com.example.Main.domain.Member.entity.Member;
import com.example.Main.domain.Member.service.MemberService;
import com.example.Main.domain.Mentor.dto.MentorDTO;
import com.example.Main.domain.Mentor.request.MentorRegistrationRequest;
import com.example.Main.domain.Mentor.service.MentorService;
import com.example.Main.global.Jwt.JwtProvider;
import com.example.Main.global.RsData.RsData;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
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

    public RsData<?> mentorRegistration(@Valid @RequestBody MentorRegistrationRequest mentorRegistrationRequest, Principal principal) {
        Member member = this.memberService.getMemberByEmail(principal.getName());

        MentorDTO mentorDTO = this.mentorService.mentorRegistration(
                member, mentorRegistrationRequest.getOneLineBio(),
                mentorRegistrationRequest.getBio(), mentorRegistrationRequest.getPortfolio()
        );
        return RsData.of("200", "멘토 등록 신청 성공", mentorDTO);
    }

    @GetMapping("/profile/{id}")
    public ResponseEntity<?> getMentorProfile(@PathVariable(value = "id") Long id) {
        Member member = memberService.getMemberById(id);
        if (member == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(RsData.of("404", "해당 ID의 멤버를 찾을 수 없습니다.", null));
        };
        MentorDTO mentorDTO = mentorService.getMentorInfoByMember(member);
        if (mentorDTO == null) {
            return ResponseEntity
                    .status(HttpStatus.NO_CONTENT)
                    .body(RsData.of("204", "멘토 정보를 찾을 수 없습니다.", null));
        }
        return ResponseEntity.ok(RsData.of("200", "멘토 정보 가져오기 성공", mentorDTO));
    }
}
