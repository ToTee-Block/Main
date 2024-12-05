package com.example.Main.domain.QnA.dto;

import com.example.Main.domain.Member.entity.Member;
import com.example.Main.domain.QnA.Comment.dto.QnACommentDTO;
import com.example.Main.domain.QnA.entity.QnA;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import lombok.Getter;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Getter
public class QnADTO {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private final Long id;

    private final String subject;

    private String content;

    private final String authorEmail;

    private final LocalDateTime createdDate;

    @LastModifiedDate
    private final LocalDateTime modifiedDate;

    private final Boolean isDraft;

    private final int likes;

    private final List<String> likedByEmails;

    // 댓글 목록
    private final List<QnACommentDTO> comments;  // QnA에 달린 댓글들

    public QnADTO(QnA qna) {
        this.id = qna.getId();
        this.subject = qna.getSubject();
        this.content = qna.getContent();
        this.authorEmail = qna.getAuthor() != null ? qna.getAuthor().getEmail() : "Unknown";
        this.createdDate = qna.getCreatedDate();
        this.modifiedDate = qna.getModifiedDate();
        this.isDraft = qna.getIsDraft();
        this.likes = qna.getLikes();

        // 좋아요 누른 멤버 이메일 추출
        Set<Member> likedByMembersSet = qna.getLikedByMembers() != null ? qna.getLikedByMembers() : Set.of();
        this.likedByEmails = likedByMembersSet.stream()
                .map(member -> member.getEmail())  // 이메일만 추출
                .collect(Collectors.toList());

        // 댓글 목록
        this.comments = qna.getComments() != null ?
                qna.getComments().stream()
                        .filter(comment -> comment.getParentComment() == null)  // 부모 댓글만 필터링
                        .map(QnACommentDTO::new)  // 댓글 DTO로 변환
                        .collect(Collectors.toList()) : List.of();
    }

    public void setContent(String content) {
        this.content = content;
    }
}
