package com.example.Main.domain.Comment.dto;

import com.example.Main.domain.Comment.entity.Comment;
import com.example.Main.domain.Member.entity.Member;
import lombok.Getter;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Getter
public class CommentDTO {

    private final Long id;
    private final String content;
    private final String authorEmail;
    private final int likes;
    private final List<String> likedByEmails;

    public CommentDTO(Comment comment) {
        this.id = comment.getId();
        this.content = comment.getContent();
        this.authorEmail = comment.getAuthor().getEmail();
        this.likes = comment.getLikes();
        Set<Member> likedByMembersSet = comment.getLikedByMembers() != null ? comment.getLikedByMembers() : Set.of();

        this.likedByEmails = likedByMembersSet.stream()
                .map(member -> member.getEmail())  // 이메일만 추출
                .collect(Collectors.toList());

    }
}
