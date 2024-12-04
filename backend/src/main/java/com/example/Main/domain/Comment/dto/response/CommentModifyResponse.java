package com.example.Main.domain.Comment.dto.response;

import com.example.Main.domain.Comment.dto.CommentDTO;
import com.example.Main.domain.Comment.entity.Comment;
import lombok.Getter;

@Getter
public class CommentModifyResponse {
    private final CommentDTO commentDTO;

    public CommentModifyResponse(Comment comment){
        this.commentDTO = new CommentDTO(comment);
    }
}

