package com.example.Main.domain.Post.dto;

import com.example.Main.domain.Member.entity.Member;
import com.example.Main.domain.Post.entity.Post;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;

@Getter
public class PostDTO {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private final Long id;

    private final String subject;

    private final String content;

    private final Member author;

    private final LocalDateTime createdDate;

    @LastModifiedDate
    private final LocalDateTime modifiedDate;

    public PostDTO(Post post) {
        this.id = post.getId();
        this.subject = post.getSubject();
        this.content = post.getContent();
        this.author = post.getAuthor();
        this.createdDate = post.getCreatedDate();
        this.modifiedDate = post.getModifiedDate();
    }
}