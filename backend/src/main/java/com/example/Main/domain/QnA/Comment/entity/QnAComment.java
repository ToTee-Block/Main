package com.example.Main.domain.QnA.Comment.entity;

import com.example.Main.domain.Member.entity.Member;
import com.example.Main.domain.QnA.entity.QnA;
import com.example.Main.global.Jpa.BaseEntity;
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
public class QnAComment extends BaseEntity {
    private String content;

    @ManyToOne
    private Member author;

    @ManyToOne
    private QnA qnA;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "comment_likes",
            joinColumns = @JoinColumn(name = "comment_id"),
            inverseJoinColumns = @JoinColumn(name = "member_id")
    )
    private Set<Member> likedByMembers = new HashSet<>();

    private int likes;

    public void addLike(Member member) {
        likedByMembers.add(member);
        likes = likedByMembers.size();
    }

    public void removeLike(Member member) {
        likedByMembers.remove(member);
        likes = likedByMembers.size();
    }

    @ManyToOne
    @JoinColumn(name = "parent_comment_id")
    private QnAComment parentComment;

    @OneToMany(mappedBy = "parentComment")
    private List<QnAComment> replies = new ArrayList<>();
}
