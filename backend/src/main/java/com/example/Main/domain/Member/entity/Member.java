package com.example.Main.domain.Member.entity;

import com.example.Main.domain.Chat.entity.ChatJoin;
import com.example.Main.domain.Member.enums.MemberGender;
import com.example.Main.domain.Member.enums.MemberRole;
import com.example.Main.domain.Mentor.entity.Mentor;
import com.example.Main.domain.Mentor.entity.MentorMenteeMatching;
import com.example.Main.domain.Mentor.entity.MentorReview;
import com.example.Main.global.Jpa.BaseEntity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Component
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

    /*
        멘토 자격 컬럼
        FetchType.LAZY는 필요할 때만 불러오도록 하기 때문에 부모엔티티인 Member에 적용
    */
    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL, mappedBy = "member", optional = true)
    @JsonIgnore
    private Mentor mentorQualify;

    /*나와 멘토 관계인 멘토 리스트*/
    @OneToMany(mappedBy = "mentee", cascade = CascadeType.ALL)
    private List<MentorMenteeMatching> myMentors;

    /*내가 작성한 멘토 리뷰들*/
    @OneToMany(mappedBy = "reviewer",cascade = CascadeType.ALL)
    private List<MentorReview> reviews;

    @OneToMany(mappedBy = "chatJoiner")
    private List<ChatJoin> chatRooms;
}
