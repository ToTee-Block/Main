package com.example.Main.domain.Post.Comment.dto.response;

import com.example.Main.domain.Post.Comment.dto.PostCommentDTO;
import com.example.Main.domain.Post.Comment.entity.PostComment;
import lombok.Getter;

@Getter
public class CommentCreateResponse {
    private final PostCommentDTO comment;

    public CommentCreateResponse(PostComment comment){
        this.comment = new PostCommentDTO(comment);
    }
}