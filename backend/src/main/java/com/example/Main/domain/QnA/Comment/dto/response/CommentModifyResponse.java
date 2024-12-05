package com.example.Main.domain.QnA.Comment.dto.response;

import com.example.Main.domain.QnA.Comment.dto.QnACommentDTO;
import com.example.Main.domain.QnA.Comment.entity.QnAComment;
import lombok.Getter;

@Getter
public class CommentModifyResponse {
    private final QnACommentDTO commentDTO;

    public CommentModifyResponse(QnAComment comment){
        this.commentDTO = new QnACommentDTO(comment);
    }
}
