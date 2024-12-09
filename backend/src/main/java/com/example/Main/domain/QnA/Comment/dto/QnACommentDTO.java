package com.example.Main.domain.QnA.Comment.dto;

import com.example.Main.domain.QnA.Comment.entity.QnAComment;
import com.example.Main.domain.Member.entity.Member;
import lombok.Getter;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Getter
public class QnACommentDTO {

    private final Long id;
    private final String content;
    private final String authorEmail;
    private final int likes;
    private final List<String> likedByEmails;
    private final Long qnAId;
    private final Long parentCommentId;
    private final List<QnACommentDTO> replies;

    public QnACommentDTO(QnAComment comment) {
        this.id = comment.getId();
        this.content = comment.getContent();
        this.authorEmail = comment.getAuthor().getEmail();

        this.likes = comment.getLikes();
        Set<Member> likedByMembersSet = comment.getLikedByMembers() != null ? comment.getLikedByMembers() : Set.of();
        this.likedByEmails = likedByMembersSet.stream()
                .map(member -> member.getEmail())
                .collect(Collectors.toList());

        // 대댓글 처리
        this.parentCommentId = comment.getParentComment() != null ? comment.getParentComment().getId() : null;
        this.replies = comment.getReplies().stream()
                .map(QnACommentDTO::new)
                .collect(Collectors.toList());

        // QnA ID 설정
        this.qnAId = comment.getQnA() != null ? comment.getQnA().getId() : null;
    }
}
