package com.example.Main.domain.Post.dto.response;

import com.example.Main.domain.Post.dto.PostDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PostResponse {
    private final PostDTO post;
}
