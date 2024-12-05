package com.example.Main.domain.Post.entity;

import com.example.Main.domain.Member.entity.Member;
import com.example.Main.global.Jpa.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@ToString(callSuper = true)
public class Post extends BaseEntity {
    private String subject;
    private String content;
    @ManyToOne
    private Member author;

    @Column(name = "is_draft")
    private Boolean isDraft;

    private int likes;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "post_likes",
            joinColumns = @JoinColumn(name = "post_id"),
            inverseJoinColumns = @JoinColumn(name = "member_id")
    )
    private Set<Member> likedByMembers = new HashSet<>(); // 좋아요를 누른 멤버들

    // 좋아요 추가
    public void addLike(Member member) {
        likedByMembers.add(member);
        likes = likedByMembers.size(); // 좋아요 수 업데이트
    }

    // 좋아요 취소
    public void removeLike(Member member) {
        likedByMembers.remove(member);
        likes = likedByMembers.size(); // 좋아요 수 업데이트
    }
}