package com.example.Main.domain.Post.Comment.dto;

import com.example.Main.domain.Post.Comment.entity.Comment;
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
    private final Long postId;
    private final Long parentCommentId;
    private final List<CommentDTO> replies;

    public CommentDTO(Comment comment) {
        this.id = comment.getId();
        this.content = comment.getContent();
        this.authorEmail = comment.getAuthor().getEmail();

        // 좋아요
        this.likes = comment.getLikes();
        Set<Member> likedByMembersSet = comment.getLikedByMembers() != null ? comment.getLikedByMembers() : Set.of();
        this.likedByEmails = likedByMembersSet.stream()
                .map(member -> member.getEmail())
                .collect(Collectors.toList());

        // 대댓글
        this.parentCommentId = comment.getParentComment() != null ? comment.getParentComment().getId() : null;
        this.replies = comment.getReplies().stream()
                .map(CommentDTO::new)
                .collect(Collectors.toList());

        // 게시글 ID 설정
        this.postId = comment.getPost() != null ? comment.getPost().getId() : null;
    }
}
