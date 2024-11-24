package com.example.Main.domain.Member.entity;

import com.example.Main.domain.Member.enums.MemberGender;
import com.example.Main.domain.Member.enums.MemberRole;
import com.example.Main.domain.Mentor.entity.Mentor;
import com.example.Main.domain.Mentor.entity.MentorMenteeMatching;
import com.example.Main.global.Jpa.BaseEntity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import java.time.LocalDate;
import java.util.List;

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

    private LocalDate birthDate;

    private MemberGender gender;

    @Column(length = 200)
    private String profileImg;

    @Column(length = 50)
    private MemberRole role;

    @JsonIgnore
    private String refreshToken;

    @OneToOne(mappedBy = "member")
    private Mentor mentorQualify;

    @OneToMany(mappedBy = "member")
    private List<MentorMenteeMatching> myMentors;
}
