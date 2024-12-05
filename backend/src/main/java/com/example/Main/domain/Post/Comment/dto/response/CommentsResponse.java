package com.example.Main.domain.Post.Comment.dto.response;

import com.example.Main.domain.Post.Comment.dto.CommentDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class CommentsResponse {
    private final List<CommentDTO> commentDTOS;
}
