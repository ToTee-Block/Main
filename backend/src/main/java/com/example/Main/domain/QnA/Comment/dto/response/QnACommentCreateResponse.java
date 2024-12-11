package com.example.Main.domain.QnA.Comment.dto.response;

import com.example.Main.domain.QnA.Comment.dto.QnACommentDTO;
import com.example.Main.domain.QnA.Comment.entity.QnAComment;
import lombok.Getter;

@Getter
public class QnACommentCreateResponse {
    private final QnACommentDTO comment;

    public QnACommentCreateResponse(QnAComment comment){
        this.comment = new QnACommentDTO(comment);
    }
}
