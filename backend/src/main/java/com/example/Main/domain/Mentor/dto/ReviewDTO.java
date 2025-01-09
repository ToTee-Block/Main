package com.example.Main.domain.Mentor.dto;

import com.example.Main.domain.Member.dto.MemberDTO;
import com.example.Main.domain.Mentor.entity.MentorReview;
import lombok.Getter;
import lombok.ToString;

@ToString
@Getter
public class ReviewDTO {
    private final Long mentorId;

    private final MemberDTO reviewer;

    private final String content;

    public ReviewDTO(MentorReview review) {
        this.mentorId = review.getMentor().getId();
        this.reviewer = new MemberDTO(review.getReviewer());
        this.content = review.getContent();
    }
}
