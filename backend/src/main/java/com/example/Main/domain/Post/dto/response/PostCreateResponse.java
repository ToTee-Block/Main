package com.example.Main.domain.Post.dto.response;

import com.example.Main.domain.Post.entity.Post;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PostCreateResponse {
    private final Post post;
}
