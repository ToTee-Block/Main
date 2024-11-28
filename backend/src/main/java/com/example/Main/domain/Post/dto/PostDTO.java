package com.example.Main.domain.Post.dto;

import com.example.Main.domain.Post.entity.Post;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
public class PostDTO {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private final Long id;

    private final String subject;

    private String content;  // Markdown을 HTML로 변환한 결과를 저장하기 위해 final을 제거

    private final String authorEmail;

    private final LocalDateTime createdDate;

    @LastModifiedDate
    private final LocalDateTime modifiedDate;

    private final Boolean isDraft;

    private final int likes;

    // 좋아요한 멤버들의 이메일 리스트
    private final List<String> likedByEmails;

    // 포스트 등록 수정 임시수정시 마크다운 문법으로 작성
    public PostDTO(Post post) {
        this.id = post.getId();
        this.subject = post.getSubject();
        this.content = post.getContent();
        this.authorEmail = post.getAuthor().getEmail();
        this.createdDate = post.getCreatedDate();
        this.modifiedDate = post.getModifiedDate();
        this.isDraft = post.getIsDraft();
        this.likes = post.getLikes();
        this.likedByEmails = post.getLikedByMembers().stream()
                .map(member -> member.getEmail())  // 이메일만 추출
                .collect(Collectors.toList());
    }

    // 포스트 등록, 수정, 임시저장 수정 시, 마크다운을 HTML로 변환한 후 그 값을 설정하여 응답
    public PostDTO(Post post, String content) {
        this.id = post.getId();
        this.subject = post.getSubject();
        this.content = content;
        this.authorEmail = post.getAuthor().getEmail();
        this.createdDate = post.getCreatedDate();
        this.modifiedDate = post.getModifiedDate();
        this.isDraft = post.getIsDraft();
        this.likes = post.getLikes();
        this.likedByEmails = post.getLikedByMembers().stream()
                .map(member -> member.getEmail())  // 이메일만 추출
                .collect(Collectors.toList());
    }

    // content 값을 동적으로 수정하는 setter
    public void setContent(String content) {
        this.content = content;
    }
}
