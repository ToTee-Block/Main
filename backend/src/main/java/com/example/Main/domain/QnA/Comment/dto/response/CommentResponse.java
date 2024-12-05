package com.example.Main.domain.QnA.Comment.dto.response;

import com.example.Main.domain.QnA.Comment.dto.QnACommentDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CommentResponse {
    private final QnACommentDTO comment;
}
