package com.example.Main.domain.Member.entity;

import com.example.Main.global.Jpa.BaseEntity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.springframework.cglib.core.Local;

import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
@SuperBuilder
@Entity
@NoArgsConstructor
public class Member extends BaseEntity {
    @Column(unique = true)
    private String username;

    @JsonIgnore
    private String password;

    private LocalDateTime birthDate;

    private char gender;

    @Column(length = 50)
    private String role;

    @JsonIgnore
    private String refreshToken;
}
