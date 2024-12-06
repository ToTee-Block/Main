package com.example.Main.domain.Post.Comment.dto.response;

import com.example.Main.domain.Post.Comment.dto.PostCommentDTO;
import com.example.Main.domain.Post.Comment.entity.PostComment;
import lombok.Getter;

@Getter
public class PostCommentCreateResponse {
    private final PostCommentDTO comment;

    public PostCommentCreateResponse(PostComment comment){
        this.comment = new PostCommentDTO(comment);
    }
}