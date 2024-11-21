package com.example.Main.domain.Member.enums;

import lombok.Getter;

@Getter
public enum MemberRole {
    ADMIN("ROLE_ADMIN"),
    USER("ROLE_USER"),
    MENTOR("ROLE_MEMBER");

    MemberRole(String value) {
        this.value = value;
    }

    private String value;

}
