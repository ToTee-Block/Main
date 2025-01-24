package com.example.Main.domain.Mentor.service;

import com.example.Main.domain.Member.entity.Member;
import com.example.Main.domain.Mentor.entity.Mentor;
import com.example.Main.domain.Mentor.entity.MentorReview;
import com.example.Main.domain.Mentor.repository.MentorReviewRepository;
import com.example.Main.global.RsData.RsData;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MentorReviewService {
    private final MentorReviewRepository reviewRepository;

    public MentorReview reviewCreate(Member reviewer, Mentor mentor, String content) {
        MentorReview review = MentorReview.builder()
                .reviewer(reviewer)
                .mentor(mentor)
                .content(content)
                .build();

        try {
            reviewRepository.save(review);
        } catch (Exception e) {
            System.out.println(e);
            return null;
        }

        return review;
    }

    public List<MentorReview> getReviewByMentorId (Long mentorId) {
        return reviewRepository.findReviewsByMentorId(mentorId);
    }
}
