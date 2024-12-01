package com.example.Main.domain.QnA.entity;

import com.example.Main.domain.Member.entity.Member;
import com.example.Main.global.Jpa.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@ToString(callSuper = true)
public class QnA extends BaseEntity {

    private String subject;
    private String content;

    @ManyToOne
    private Member author;

    @Column(name = "is_draft")
    private Boolean isDraft;  // 임시 저장 여부

    private int likes;  // 좋아요 수

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "qna_likes",
            joinColumns = @JoinColumn(name = "qna_id"),
            inverseJoinColumns = @JoinColumn(name = "member_id")
    )
    private Set<Member> likedByMembers = new HashSet<>();

    // 좋아요 추가
    public void addLike(Member member) {
        likedByMembers.add(member);
        likes = likedByMembers.size();
    }

    // 좋아요 취소
    public void removeLike(Member member) {
        likedByMembers.remove(member);
        likes = likedByMembers.size();
    }
}
