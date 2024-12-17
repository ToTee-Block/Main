package com.example.Main.domain.Post.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PostCreateRequest {
    @NotBlank(message = "제목은 필수 입력 항목입니다.")
    private String subject;

    @NotBlank(message = "내용은 필수 입력 항목입니다.")
    private String content;

    private Boolean isDraft;
}
