package com.example.Main.domain.Mentor.entity;

import com.example.Main.domain.Member.entity.Member;
import com.example.Main.global.Jpa.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Getter
@Setter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Mentor extends BaseEntity {
   @OneToOne(fetch = FetchType.LAZY)
   @JoinColumn(name = "member_id")
   @NotNull
   private Member member;

   @Column(columnDefinition = "text")
   private String bio;

   private Boolean approved;

   private Boolean matchingStatus;

   @Column(length = 200)
   private String oneLiner;

   @OneToMany(mappedBy = "mentor")
   private List<MentorMenteeMatching> myMentees;
}
