package com.example.Main.domain.QnA.Comment.dto.response;

import com.example.Main.domain.QnA.Comment.dto.QnACommentDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class CommentsResponse {
    private final List<QnACommentDTO> commentDTOS;
}
