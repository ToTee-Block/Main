package com.example.Main.domain.Post.Comment.dto;

import com.example.Main.domain.Post.Comment.entity.PostComment;
import com.example.Main.domain.Member.entity.Member;
import lombok.Getter;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Getter
public class PostCommentDTO {

    private final Long id;
    private final String content;
    private final String authorEmail;
    private final String authorName;
    private final String profileImg;
    private final int likes;
    private final LocalDateTime createDate;   // 열람 시간과 작성 시간의 차이
    private final List<String> likedByEmails;
    private final Long postId;
    private final Long parentCommentId;
    private final List<PostCommentDTO> replies;

    public PostCommentDTO(PostComment comment) {
        this.id = comment.getId();
        this.content = comment.getContent();
        this.authorEmail = comment.getAuthor().getEmail();
        this.authorName = comment.getAuthor().getName();
        this.profileImg = comment.getAuthor().getProfileImg();
        this.createDate = comment.getCreatedDate();

        // 좋아요
        this.likes = comment.getLikes();
        Set<Member> likedByMembersSet = comment.getLikedByMembers() != null ? comment.getLikedByMembers() : Set.of();
        this.likedByEmails = likedByMembersSet.stream()
                .map(member -> member.getEmail())
                .collect(Collectors.toList());

        // 대댓글
        this.parentCommentId = comment.getParentComment() != null ? comment.getParentComment().getId() : null;
        this.replies = comment.getReplies().stream()
                .map(PostCommentDTO::new)
                .collect(Collectors.toList());

        // 게시글 ID 설정
        this.postId = comment.getPost() != null ? comment.getPost().getId() : null;
    }
}
