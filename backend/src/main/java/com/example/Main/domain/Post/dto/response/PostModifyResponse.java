package com.example.Main.domain.Post.dto.response;

import com.example.Main.domain.Post.entity.Post;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PostModifyResponse {
    private final Post post;
    private final Boolean isDraft;

    public PostModifyResponse(Post post) {
        this.post = post;
        this.isDraft = post.getIsDraft();
    }
}
