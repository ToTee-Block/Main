package com.example.Main.domain.Post.Comment.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class CommentCreateRequest {
    @NotBlank(message = "댓글 내용을 입력해 주세요.")
    private String content;

    private Long parentCommentId;
}
