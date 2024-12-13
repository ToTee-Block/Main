package com.example.Main.domain.Post.Comment.entity;

import com.example.Main.domain.Member.entity.Member;
import com.example.Main.domain.Post.entity.Post;
import com.example.Main.global.Jpa.BaseEntity;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
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
public class PostComment extends BaseEntity {
    private String content;

    @ManyToOne
    private Member author;

    @ManyToOne
    private Post post;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "post_comment_likes",
            joinColumns = @JoinColumn(name = "comment_id"),
            inverseJoinColumns = @JoinColumn(name = "member_id")
    )
    private Set<Member> likedByMembers = new HashSet<>();

    private int likes;
    @ManyToOne
    @JoinColumn(name = "parent_comment_id")
    private PostComment parentComment;

    @OneToMany(mappedBy = "parentComment")
    private List<PostComment> replies = new ArrayList<>();

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
