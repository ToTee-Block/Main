package com.example.Main.domain.Mentor.controller;

import com.example.Main.domain.Member.dto.MemberDTO;
import com.example.Main.domain.Member.entity.Member;
import com.example.Main.domain.Member.service.MemberService;
import com.example.Main.domain.Mentor.dto.MentorDTO;
import com.example.Main.domain.Mentor.entity.Mentor;
import com.example.Main.domain.Mentor.request.MentoringRequest;
import com.example.Main.domain.Mentor.service.MentorService;
import com.example.Main.global.Jwt.JwtProvider;
import com.example.Main.global.RsData.RsData;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin/mentors")
public class ApiV1AdminMentorController {
    private final MentorService mentorService;
    private final JwtProvider jwtProvider;
    private final MemberService memberService;

    @PreAuthorize("isAuthenticated()")
    @GetMapping("")    // 멘토 목록 - 아직 허가되지 않은 멘토 목록
    public RsData mentorRequestList(@RequestParam(value = "page", defaultValue = "0") int page) {
        Page<Mentor> mentors = this.mentorService.getApprovedFalse(page);

        return RsData.of("200", "멘토 신청 리스트", mentors);
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/approve")    // 멘토 허가
    public RsData mentorPermit(@Valid @RequestBody MentoringRequest mentoringRequest) {
        // 멤버와 멘토로서 검증
        Member member = this.memberService.getMemberById(mentoringRequest.getMentorId());
        if (member == null) {
            return RsData.of("400", "존재하는 멤버가 아닙니다.");
        }
        Mentor mentor = this.mentorService.getMentorById(member.getMentorQualify().getId());
        if (mentor == null) {
            return RsData.of("400", "존재하는 멘토가 아닙니다.", new MemberDTO(member));
        }

        // approve가 true일 때
        if (mentoringRequest.isApprove()) {
            Mentor permittedMentor = this.mentorService.approveMentor(mentor);
            return RsData.of("200", "멘토 승인 완료", new MentorDTO(permittedMentor));
        }

        // approve가 false일 때
        this.mentorService.denyMentor(mentor);
        return RsData.of("200", "멘토 거부 완료");
    }
}
