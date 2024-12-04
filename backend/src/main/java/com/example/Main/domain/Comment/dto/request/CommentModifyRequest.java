package com.example.Main.domain.Comment.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class CommentModifyRequest {
    @NotBlank(message = "댓글 내용을 입력해 주세요.")
    private String content;

}
