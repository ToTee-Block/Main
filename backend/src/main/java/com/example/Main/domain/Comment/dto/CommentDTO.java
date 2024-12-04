package com.example.Main.domain.Comment.dto;

import com.example.Main.domain.Comment.entity.Comment;
import lombok.Getter;

@Getter
public class CommentDTO {

    private final Long id;
    private final String content;
    private final String authorEmail;
    private final int likesCount;

    public CommentDTO(Comment comment) {
        this.id = comment.getId();
        this.content = comment.getContent();
        this.authorEmail = comment.getAuthor().getEmail();
        this.likesCount = comment.getLikedBy() != null ? comment.getLikedBy().size() : 0;
    }
}
