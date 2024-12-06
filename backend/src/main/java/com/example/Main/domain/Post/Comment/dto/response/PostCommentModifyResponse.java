package com.example.Main.domain.Post.Comment.dto.response;

import com.example.Main.domain.Post.Comment.dto.PostCommentDTO;
import com.example.Main.domain.Post.Comment.entity.PostComment;
import lombok.Getter;

@Getter
public class PostCommentModifyResponse {
    private final PostCommentDTO commentDTO;

    public PostCommentModifyResponse(PostComment comment){
        this.commentDTO = new PostCommentDTO(comment);
    }
}

