package com.example.Main.domain.Post.dto.response;

import com.example.Main.domain.Post.dto.PostDTO;
import com.example.Main.domain.Post.entity.Post;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PostModifyResponse {

    private final PostDTO postDTO;

    private final Boolean isDraft;

    public PostModifyResponse(Post post) {
        this.postDTO = new PostDTO(post);
        this.isDraft = post.getIsDraft();
    }
}
