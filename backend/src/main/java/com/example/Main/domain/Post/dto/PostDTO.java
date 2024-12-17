package com.example.Main.domain.Post.dto;

import com.example.Main.domain.Post.Comment.dto.PostCommentDTO;
import com.example.Main.domain.Member.entity.Member;
import com.example.Main.domain.Post.entity.Post;
import com.example.Main.domain.TechStack.enums.TechStacks;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Getter
public class PostDTO {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private final Long id;

    private final String subject;

    private String content;  // 마크다운을 HTML로 변환한 결과를 저장하기 위해 final을 제거

    private final String authorEmail;

    private final String authorName;

    private final LocalDateTime createdDate;

    @LastModifiedDate
    private final LocalDateTime modifiedDate;

    private final Set<String> techStacks;

    private final Boolean isDraft;

    private final int likes;

    // 좋아요한 멤버들의 이메일 리스트
    private final List<String> likedByEmails;

    // 댓글 목록
    private final List<PostCommentDTO> comments; // 포스트에 달린 댓글들

    // 포스트 등록 수정 임시수정시 마크다운 문법으로 작성
    public PostDTO(Post post) {
        this.id = post.getId();
        this.subject = post.getSubject();
        this.content = post.getContent();
        this.authorEmail = post.getAuthor().getEmail();
        this.authorName = post.getAuthor() != null ? post.getAuthor().getName() : "Unknown";
        this.createdDate = post.getCreatedDate();
        this.modifiedDate = post.getModifiedDate();
        this.techStacks = post.getTechStacks();
        this.isDraft = post.getIsDraft();
        this.likes = post.getLikes();

        // 좋아요누른 맴버가 null일 경우 빈 []으로 처리
        Set<Member> likedByMembersSet = post.getLikedByMembers() != null ? post.getLikedByMembers() : Set.of();

        // 좋아요누른 맴버가 null일 경우 빈 리스트로 처리
        this.likedByEmails = likedByMembersSet.stream()
                .map(member -> member.getEmail())  // 이메일만 추출
                .collect(Collectors.toList());

        // 댓글 목록
        this.comments = post.getComments() != null ?
                post.getComments().stream()
                        .filter(comment -> comment.getParentComment() == null) // 부모 댓글만 필터링
                        .map(PostCommentDTO::new)
                        .collect(Collectors.toList()) : List.of();
    }

    // content 값을 동적으로 수정하는 setter
    public void setContent(String content) {
        this.content = content;
    }
}
