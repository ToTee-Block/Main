package com.example.Main.domain.Member.dto;


import com.example.Main.domain.Member.entity.Member;
import lombok.Getter;
import lombok.ToString;

import java.time.LocalDateTime;

@ToString
@Getter
public class MemberDTO {
    private final Long id;

    private final String username;

    private final LocalDateTime createdDate;

    private final LocalDateTime modifiedDate;

    public MemberDTO(Member member) {
        this.id = member.getId();
        this.username = member.getUsername();
        this.createdDate = member.getCreatedDate();
        this.modifiedDate = member.getModifiedDate();
    }
}