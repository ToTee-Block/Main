package com.example.Main.domain.QnA.Comment.dto.response;

import com.example.Main.domain.QnA.Comment.dto.QnACommentDTO;
import com.example.Main.domain.QnA.Comment.entity.QnAComment;
import lombok.Getter;

@Getter
public class CommentCreateResponse {
    private final QnACommentDTO comment;

    public CommentCreateResponse(QnAComment comment){
        this.comment = new QnACommentDTO(comment);
    }
}
