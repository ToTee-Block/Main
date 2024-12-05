package com.example.Main.domain.Mentor.entity;

import com.example.Main.domain.Member.entity.Member;
import com.example.Main.global.Jpa.BaseEntity;
import jakarta.persistence.Column;
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
public class MentorReview extends BaseEntity {
    @Column(columnDefinition = "text")
    private String content;

    @ManyToOne
    @JoinColumn(name = "member_id")
    private Member reviewer;

    @ManyToOne
    @JoinColumn(name = "mentor_id")
    private Mentor mentor;
}
