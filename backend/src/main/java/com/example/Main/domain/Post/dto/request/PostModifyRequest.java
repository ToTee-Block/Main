package com.example.Main.domain.Post.dto.request;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;


@Getter
@Setter
public class PostModifyRequest {
    @NotNull
    private String subject;
    @NotNull
    private String content;
    @NotNull
    private String author;
}
