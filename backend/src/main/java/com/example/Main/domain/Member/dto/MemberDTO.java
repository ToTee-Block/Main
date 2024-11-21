package com.example.Main.domain.Member.dto;


import com.example.Main.domain.Member.entity.Member;
import com.example.Main.domain.Member.enums.MemberGender;
import com.example.Main.domain.Member.enums.MemberRole;
import lombok.Getter;
import lombok.ToString;

import java.time.LocalDate;
import java.time.LocalDateTime;

@ToString
@Getter
public class MemberDTO {
    private final Long id;

    private final String email;

    private final String name;

    private final LocalDate birthDate;

    private final MemberGender gender;

    private final MemberRole role;

    private final String profileImg;

    private final LocalDateTime createdDate;

    private final LocalDateTime modifiedDate;

    public MemberDTO(Member member) {
        this.id = member.getId();
        this.email = member.getEmail();
        this.name = member.getName();
        this.birthDate = member.getBirthDate();
        this.role = member.getRole();
        this.profileImg = member.getProfileImg();
        this.gender = member.getGender();
        this.createdDate = member.getCreatedDate();
        this.modifiedDate = member.getModifiedDate();
    }
}