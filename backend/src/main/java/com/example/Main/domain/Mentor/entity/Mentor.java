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
   @OneToOne
   @JoinColumn(name = "member_id", nullable = false)
   @NotNull
   private Member member;

   @Column(columnDefinition = "text")
   private String bio;

   private Boolean approved;

   private Boolean matchingStatus;

   @Column(length = 200)
   private String oneLineBio;

   @Column(columnDefinition = "text")
   private String portfolio;

   /*내 멘티들*/
   @OneToMany(mappedBy = "mentor")
   private List<MentorMenteeMatching> myMentees;

   /*나한테 달린 리뷰들*/
   @OneToMany(mappedBy = "mentor")
   private List<MentorReview> reviews;

   @OneToMany(mappedBy = "mentor")
   private List<MentorTechStack> techStacks;
}
