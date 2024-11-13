package com.example.Main.domain.Member.entity;

import com.example.Main.domain.Member.enums.MemberGender;
import com.example.Main.domain.Member.enums.MemberRole;
import com.example.Main.global.Jpa.BaseEntity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@Getter
@Setter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Member extends BaseEntity {
    @Column(unique = true)
    private String username;

    @JsonIgnore
    private String password;

    private LocalDateTime birthDate;

    private MemberGender gender;

    @Column(length = 50)
    private MemberRole role;

    @JsonIgnore
    private String refreshToken;
}
