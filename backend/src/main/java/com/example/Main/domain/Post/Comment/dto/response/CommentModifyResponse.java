package com.example.Main.domain.Post.Comment.dto.response;

import com.example.Main.domain.Post.Comment.dto.CommentDTO;
import com.example.Main.domain.Post.Comment.entity.Comment;
import lombok.Getter;

@Getter
public class CommentModifyResponse {
    private final CommentDTO commentDTO;

    public CommentModifyResponse(Comment comment){
        this.commentDTO = new CommentDTO(comment);
    }
}

