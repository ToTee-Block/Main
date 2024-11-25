package com.example.Main.domain.Mentor.dto;

import com.example.Main.domain.Member.entity.Member;
import com.example.Main.domain.Member.enums.MemberGender;
import com.example.Main.domain.Member.enums.MemberRole;
import lombok.Getter;
import lombok.ToString;

import java.time.LocalDate;
import java.time.LocalDateTime;

@ToString
@Getter
public class MentorDTO {
    private final Long id;

    private final LocalDateTime createdDate;

    private final LocalDateTime modifiedDate;

    private final String name;

    private final String profileImg;

    private final String oneLineBio;

    private final String bio;



    public MentorDTO(Member member) {
        this.id = member.getId();
        this.createdDate = member.getCreatedDate();
        this.modifiedDate = member.getModifiedDate();
        this.name = member.getName();
        this.profileImg = member.getProfileImg();
        this.oneLineBio = member.getMentorQualify().getOneLineBio();
        this.bio = member.getMentorQualify().getBio();
    }
}
