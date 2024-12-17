package com.example.Main.domain.Report.dto.summary;

import com.example.Main.domain.Post.entity.Post;
import lombok.Getter;

@Getter
public class PostSummaryDTO {

    private final Long postId;
    private final String postUrl;
    private final String authorName;
    private final String subject;

    public PostSummaryDTO(Post post) {
        this.postId = post.getId();
        this.postUrl = post.getId() != null ? "http://localhost:8081/api/v1/post/" + post.getId() : "";
        this.authorName = post.getAuthor() != null ? post.getAuthor().getName() : "Unknown";
        this.subject = post.getSubject();
    }
}
