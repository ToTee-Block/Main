package com.example.Main.domain.Post.dto.response;

import com.example.Main.domain.Post.dto.PostDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class PostsResponse {
    private final List<PostDTO> postDTOS;
}
