package com.example.Main.domain.Mentor.dto;

import com.example.Main.domain.Member.entity.Member;
import com.example.Main.domain.Mentor.entity.Mentor;
import com.example.Main.domain.Mentor.entity.MentorTechStack;
import lombok.Getter;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.List;

@ToString
@Getter
public class MentorDTO {
    private final Long id;

    private final String name;

    private final String profileImg;

    private final LocalDateTime createdDate;

    private final LocalDateTime modifiedDate;

    private final String oneLineBio;

    private final String bio;

    private String portfolio;

    private Boolean approved;

    private Boolean matchingStatus;

    /*private List<MentorTechStack> techStacks;*/


    public MentorDTO(Mentor mentor) {
        Member member = mentor.getMember();
        this.name = member.getName();
        this.profileImg = member.getProfileImg();

        this.id = mentor.getId();
        this.createdDate = mentor.getCreatedDate();
        this.modifiedDate = mentor.getModifiedDate();
        this.oneLineBio = mentor.getOneLineBio();
        this.bio = mentor.getBio();
        this.portfolio = mentor.getPortfolio();;
        this.approved = mentor.getApproved();
        this.matchingStatus = mentor.getMatchingStatus();
        /*this.techStacks = mentor.getTechStacks();*/
    }
}