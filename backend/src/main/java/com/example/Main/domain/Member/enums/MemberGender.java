package com.example.Main.domain.Member.enums;

import lombok.Getter;

@Getter
public enum MemberGender {
    M("MEN"),
    F("FEMALE"),
    O("OTHER");

    MemberGender(String value) {
        this.value = value;
    }

    private String value;

}
