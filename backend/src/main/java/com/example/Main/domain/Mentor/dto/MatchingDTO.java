package com.example.Main.domain.Mentor.dto;

import com.example.Main.domain.Member.entity.Member;
import com.example.Main.domain.Mentor.entity.Mentor;
import com.example.Main.domain.Mentor.entity.MentorMenteeMatching;
import lombok.Getter;
import lombok.ToString;

@ToString
@Getter
public class MatchingDTO {
    private final Long matchingId;

    private final boolean approve;

    private final String name;

    private final Long mentorId;

    private final Long menteeId;

    public MatchingDTO(MentorMenteeMatching mentorMenteeMatching, Member member) {
    this.matchingId = mentorMenteeMatching.getId();
    this.approve = mentorMenteeMatching.getApproved();
    this.name = member.getName();
    this.mentorId = mentorMenteeMatching.getMentor().getId();
    this.menteeId = mentorMenteeMatching.getMentee().getId();
    }
}
