package com.example.Main.domain.Mentor.controller;

import com.example.Main.domain.Member.dto.MemberDTO;
import com.example.Main.domain.Member.entity.Member;
import com.example.Main.domain.Member.service.MemberService;
import com.example.Main.domain.Mentor.dto.MentorDTO;
import com.example.Main.domain.Mentor.entity.Mentor;
import com.example.Main.domain.Mentor.request.MentorRegistrationRequest;
import com.example.Main.domain.Mentor.service.MentorService;
import com.example.Main.global.Jwt.JwtProvider;
import com.example.Main.global.RsData.RsData;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin/mentors")
public class ApiV1AdminMentorController {
    private final MentorService mentorService;
    private final JwtProvider jwtProvider;
    private final MemberService memberService;

    @PreAuthorize("isAuthenticated()")
    @GetMapping("")
    public RsData mentorRequestList(@RequestParam(value = "page", defaultValue = "0") int page) {
        Page<Mentor> mentors = this.mentorService.getApprovedFalse(page);

        return RsData.of("200", "멘토 신청 리스트", mentors);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/permit/{mentorId}")
    public RsData mentorPermit(@PathVariable(value = "mentorId") Long mentorId) {
        Member member = this.memberService.getMemberById(mentorId);
        if (member == null) {
            return RsData.of("400", "존재하는 멤버가 아닙니다.");
        }

        Mentor mentor = this.mentorService.permitMentor(member);
        if (mentor == null) {
            return RsData.of("400", "존재하는 멘토가 아닙니다.", new MemberDTO(member));
        }

        return RsData.of("200", "멘토 허가 완료", new MentorDTO(mentor));
    }
}
