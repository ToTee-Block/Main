package com.example.Main.domain.Member.entity;

import com.example.Main.domain.Member.enums.MemberGender;
import com.example.Main.domain.Member.enums.MemberRole;
import com.example.Main.global.Jpa.BaseEntity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.validation.constraints.Email;
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
    @Email
    private String email;

    @JsonIgnore
    private String password;

    @Column(length = 50)
    private String name;

    private LocalDateTime birthDate;

    private MemberGender gender;

    @Column(length = 200)
    private String profileImg;

    @Column(length = 50)
    private MemberRole role;

    @JsonIgnore
    private String refreshToken;
}
