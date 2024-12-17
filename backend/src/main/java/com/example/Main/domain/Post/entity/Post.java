package com.example.Main.domain.Post.entity;

import com.example.Main.domain.Post.Comment.entity.PostComment;
import com.example.Main.domain.Member.entity.Member;
import com.example.Main.global.Jpa.BaseEntity;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
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
public class Post extends BaseEntity {
    private String subject;

    private String content;

    @ManyToOne
    private Member author;

    private Set<String> techStacks;

    @Column(name = "is_draft")
    private Boolean isDraft;

    private int likes;

    @ManyToMany
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

    // 댓글 목록
    @OneToMany(mappedBy = "post", fetch = FetchType.EAGER)
    @OrderBy("createdDate DESC")
    @JsonManagedReference  // 순환 참조 방지를 위해 부모 객체에 적용
    private List<PostComment> comments;

    private String thumbnail;
    private List<String> filePaths;
}