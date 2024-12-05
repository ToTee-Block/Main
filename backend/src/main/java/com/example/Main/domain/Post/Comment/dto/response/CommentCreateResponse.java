package com.example.Main.domain.Post.Comment.dto.response;

import com.example.Main.domain.Post.Comment.dto.CommentDTO;
import com.example.Main.domain.Post.Comment.entity.Comment;
import lombok.Getter;

@Getter
public class CommentCreateResponse {
    private final CommentDTO comment;

    public CommentCreateResponse(Comment comment){
        this.comment = new CommentDTO(comment);
    }
}