package com.example.Main.domain.Mentor.controller;

import com.example.Main.domain.Member.entity.Member;
import com.example.Main.domain.Member.service.MemberService;
import com.example.Main.domain.Mentor.dto.ReviewDTO;
import com.example.Main.domain.Mentor.entity.Mentor;
import com.example.Main.domain.Mentor.entity.MentorReview;
import com.example.Main.domain.Mentor.request.MentorReviewRequest;
import com.example.Main.domain.Mentor.service.MentorReviewService;
import com.example.Main.domain.Mentor.service.MentorService;
import com.example.Main.domain.Post.dto.PostDTO;
import com.example.Main.global.RsData.RsData;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/reviews")
public class ApiV1MentorReviewController {
    private final MentorReviewService reviewService;
    private final MemberService memberService;
    private final MentorService mentorService;

    @PreAuthorize("isAuthenticated()")
    @PostMapping("")
    public RsData write(@RequestBody @Valid MentorReviewRequest reviewRequest) {
        Member reviewer = memberService.getMemberById(reviewRequest.getReviewerId());
        Mentor mentor = mentorService.getMentorById(reviewRequest.getMentorId());

        if (reviewer == null) {
            return RsData.of("400", "%d번의 사용자는 존재하지 않습니다.".formatted(reviewRequest.getReviewerId()));
        }
        if (mentor == null) {
            return  RsData.of("400", "%d번의 멘토는 존재하지 않습니다.".formatted(reviewRequest.getMentorId()));
        }

        MentorReview review = reviewService.reviewCreate(reviewer, mentor, reviewRequest.getContent());
        if (review == null) {
            return  RsData.of("500", "리뷰등록에 실패했습니다.");
        }

        return RsData.of("200", "리뷰등록에 성공했습니다.", new ReviewDTO(review));
    }

    @GetMapping("/{mentorId}")
    public RsData getReviewsByMentor(@PathVariable(value = "mentorId") Long id) {
        List<MentorReview> reviews = reviewService.getReviewByMentorId(id);

        List<ReviewDTO> reviewDTOS = reviews.stream()
                .map(ReviewDTO::new)
                .collect(Collectors.toList());

        return RsData.of("200", "멘토의 후기 목록", reviewDTOS);
    }
}
