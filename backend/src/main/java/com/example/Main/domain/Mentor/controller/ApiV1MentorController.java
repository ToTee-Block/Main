package com.example.Main.domain.Mentor.controller;

import com.example.Main.domain.Member.dto.MemberDTO;
import com.example.Main.domain.Member.entity.Member;
import com.example.Main.domain.Member.service.MemberService;
import com.example.Main.domain.Mentor.dto.MatchingDTO;
import com.example.Main.domain.Mentor.dto.MentorDTO;
import com.example.Main.domain.Mentor.entity.Mentor;
import com.example.Main.domain.Mentor.entity.MentorMenteeMatching;
import com.example.Main.domain.Mentor.request.ApproveMentoringRequest;
import com.example.Main.domain.Mentor.request.MentorRegistrationRequest;
import com.example.Main.domain.Mentor.service.MentorMenteeMatchingService;
import com.example.Main.domain.Mentor.service.MentorService;
import com.example.Main.global.Jwt.JwtProvider;
import com.example.Main.global.RsData.RsData;
import com.example.Main.domain.notification.service.NotificationService;
import jakarta.transaction.Transactional;
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

import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;
import java.security.Principal;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/mentors")
public class ApiV1MentorController {
    private final MentorService mentorService;
    private final JwtProvider jwtProvider;
    private final MemberService memberService;
    private final MentorMenteeMatchingService matchingService;
    private final NotificationService notificationService;

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/registration")
    @Transactional
    public RsData<?> mentorRegistration(@Valid @RequestBody MentorRegistrationRequest mentorRegistrationRequest, Principal principal) {
        Member member = this.memberService.getMemberByEmail(principal.getName());

        // 멘토 등록 처리
        MentorDTO mentorDTO = this.mentorService.mentorRegistration(
                member,
                mentorRegistrationRequest.getOneLineBio(),
                mentorRegistrationRequest.getBio(),
                mentorRegistrationRequest.getPortfolio()
        );

        // 관리자에게 새로운 멘토 등록 신청 알림 전송 (한 번만 호출)
        notificationService.sendNotificationToAdmins(member.getName() + "님께서 멘토 등록 신청하셨습니다.");

        // 신청자에게 확인 알림 전송
        notificationService.sendNotification(
                member.getId().toString(),
                "멘토 신청이 성공적으로 접수되었습니다."
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

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/myMentoring/requests")
    public RsData getMyMentoring(Principal principal) {
        Member member = this.memberService.getMemberByEmail(principal.getName());

        if (member.getMentorQualify() == null) {
            return RsData.of("400", "멘토 자격이 없습니다.", null);
        }

        Mentor mentor = this.mentorService.getMentorById(member.getMentorQualify().getId());

        List<MentorMenteeMatching> matchings = this.matchingService.myMentoringList(mentor);
        List<MatchingDTO> matchingDTOs = matchings.stream()
                .map(matching -> new MatchingDTO(matching, matching.getMentee()))
                .collect(Collectors.toList());

        return RsData.of("200", "멘토: 내 멘토링 신청 목록", matchingDTOs);
    }

    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/myMentoring/disconnect/{matchingId}")
    public RsData disconnectMentoring(@PathVariable("matchingId") Long matchingId, Principal principal) {
        Member member = this.memberService.getMemberByEmail(principal.getName());

        MentorMenteeMatching matching = this.matchingService.getMatchingById(matchingId);
        if (matching == null) {
            return RsData.of("400", "존재하지 않는 멘토링 매치입니다.");
        }

        // 요청자가 멘토 또는 멘티인지 확인
        if (!matching.getMentor().getMember().equals(member) && !matching.getMentee().equals(member)) {
            return RsData.of("403", "이 멘토링 관계를 끊을 권한이 없습니다.");
        }

        // 매칭 데이터를 데이터베이스에서 삭제
        this.matchingService.deleteMatching(matching);

        return RsData.of("200", "멘토링 관계가 성공적으로 삭제되었습니다.");
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/myMentoring/inProgress")
    public RsData getMyMentoringInProgress(Principal principal) {
        Member member = this.memberService.getMemberByEmail(principal.getName());
        Mentor mentor = this.mentorService.getMentorById(member.getMentorQualify().getId());

        List<MentorMenteeMatching> matchings = this.matchingService.myApprovedMentoringList(mentor);
        List<MemberDTO> mentees = matchings.stream()    // 멘티의 정보만 DTO의 형식으로 재구성하여 리스트 만들기
                .map(matching -> new MemberDTO(matching.getMentee()))
                .collect(Collectors.toList());

        return RsData.of("200", "멘토: 내 진행중인 멘토링 목록", mentees);
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/myMentoring/approve")
    public RsData approveMentoring(@Valid @RequestBody ApproveMentoringRequest amr) {
        MentorMenteeMatching matching = this.matchingService.getMatchingById(amr.getMatchingId());
        if (matching == null) {
            return RsData.of("400","존재하는 멘토링 매치가 아닙니다.");
        }

        if (amr.isApprove()) {
            this.matchingService.approveMatching(matching);

            // 멘티에게 알림 전송
            notificationService.sendNotification(matching.getMentee().getId().toString(),"멘토링 요청이 승인되었습니다.");
            return RsData.of("200", "멘토: 멘토링 승인 완료", new MemberDTO(matching.getMentee()));
        }

        this.matchingService.denyMatching(matching);

        // 멘티에게 알림 전송
        notificationService.sendNotification(matching.getMentee().getId().toString(),"멘토링 요청이 거절되었습니다.");
        return RsData.of("200", "멘토: 멘토링 거절 완료");
    }
}
