package com.example.Main.domain.Post.controller;

import com.example.Main.domain.Post.dto.PostDTO;
import com.example.Main.domain.Post.dto.request.PostCreateRequest;
import com.example.Main.domain.Post.dto.request.PostModifyRequest;
import com.example.Main.domain.Post.dto.response.PostCreateResponse;
import com.example.Main.domain.Post.dto.response.PostModifyResponse;
import com.example.Main.domain.Post.dto.response.PostResponse;
import com.example.Main.domain.Post.dto.response.PostsResponse;
import com.example.Main.domain.Post.entity.Post;
import com.example.Main.domain.Post.service.PostService;
import com.example.Main.global.RsData.RsData;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/api/v1/post")
public class ApiV1PostController {
    private final PostService postService;

    @GetMapping("") // 다건조회
    public RsData<PostsResponse> list() {
        List<PostDTO> postDTOS = this.postService.getList();

        return RsData.of("200", "게시글 다건 조회 성공", new PostsResponse(postDTOS));
    }

    @GetMapping("/{id}") // 단건조회
    public RsData<PostResponse> getPost(@PathVariable("id") Long id) {
        Post post = this.postService.getPost(id);

        if (post == null)
            return RsData.of("500", "%d 번 게시물은 존재하지 않습니다.".formatted(id), null);

        PostDTO postDTO = new PostDTO(post);
        return RsData.of("200", "게시글 단건 조회 성공", new PostResponse(postDTO));
    }

    @PostMapping("") // 생성
    public RsData<PostCreateResponse> create(@Valid @RequestBody PostCreateRequest postCreateRequest) {
        Post post = this.postService.write(postCreateRequest.getSubject(), postCreateRequest.getContent(), postCreateRequest.getAuthor());

        return RsData.of("200", "게시글 등록 성공", new PostCreateResponse(post));
    }

    @PatchMapping("/{id}") // 수정
    public RsData<PostModifyResponse> modify(@PathVariable("id") Long id, @Valid @RequestBody PostModifyRequest postModifyRequest) {
        Post post = this.postService.getPost(id);

        if (post == null)
            return RsData.of("500", "%d 번 게시물은 존재하지 않습니다.".formatted(id), null);

        post = this.postService.update(post, postModifyRequest.getSubject(), postModifyRequest.getContent(), postModifyRequest.getAuthor());

        return RsData.of("200", "게시글 수정 성공", new PostModifyResponse(post));
    }

    @DeleteMapping("/{id}")  // 삭제
    @Operation(summary = "포스트 삭제")
    public RsData<PostResponse> delete(@PathVariable("id") Long id) {
        Post post = this.postService.getPost(id);

        if (post == null)
            return RsData.of("500", "%d 번 게시물은 존재하지 않습니다.".formatted(id), null);

        this.postService.delete(post);
        PostDTO postDTO = new PostDTO(post);

        return RsData.of("200", "%d 번 게시물 삭제 성공".formatted(id), new PostResponse(postDTO));
    }
}