package com.example.Main.domain.QnA.entity;

import com.example.Main.domain.Member.entity.Member;
import com.example.Main.domain.QnA.Comment.entity.QnAComment;
import com.example.Main.global.Jpa.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.HashSet;
import java.util.List;
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
    private Boolean isDraft;

    private int likes;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "qna_likes",
            joinColumns = @JoinColumn(name = "qna_id"),
            inverseJoinColumns = @JoinColumn(name = "member_id")
    )
    private Set<Member> likedByMembers = new HashSet<>();  // 좋아요를 누른 멤버들

    // 좋아요 추가
    public void addLike(Member member) {
        likedByMembers.add(member);
        likes = likedByMembers.size();  // 좋아요 수 업데이트
    }

    // 좋아요 취소
    public void removeLike(Member member) {
        likedByMembers.remove(member);
        likes = likedByMembers.size();  // 좋아요 수 업데이트
    }

    // 댓글 목록
    @OneToMany(mappedBy = "qnA", fetch = FetchType.LAZY)
    @OrderBy("createdDate DESC")
    private List<QnAComment> comments;
}