package com.example.Main.domain.Comment.dto.response;

import com.example.Main.domain.Comment.dto.CommentDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CommentResponse {
    private final CommentDTO comment;
}

