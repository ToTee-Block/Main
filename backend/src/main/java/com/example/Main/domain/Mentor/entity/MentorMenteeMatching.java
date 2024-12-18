package com.example.Main.domain.Mentor.entity;

import com.example.Main.domain.Member.entity.Member;
import com.example.Main.global.Jpa.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class MentorMenteeMatching extends BaseEntity {
    @ManyToOne
    @JoinColumn(name = "member_id")
    private Member mentee;

    @ManyToOne
    @JoinColumn(name = "mentor_id")
    private Mentor mentor;

    private Boolean approved;    // 멘토의 승인여부
}
