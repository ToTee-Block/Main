package com.example.Main.domain.Comment.entity;

import com.example.Main.domain.Member.entity.Member;
import com.example.Main.domain.Post.entity.Post;
import com.example.Main.domain.QnA.entity.QnA;
import com.example.Main.global.Jpa.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.ArrayList;
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
public class Comment extends BaseEntity {
    private String content;

    @ManyToOne
    private Member author;

    @ManyToOne
    private Post post;

    @ManyToMany
    private List<Member> likedBy = new ArrayList<>();
    @ManyToMany
    private Set<Member> likedByMembers = new HashSet<>(); // 좋아요를 누른 멤버들

    // 좋아요 추가
    public void addLike(Member member) {
        this.likedBy.add(member);
    }

    // 좋아요 취소
    public void removeLike(Member member) {
        this.likedBy.remove(member);
    }
}
