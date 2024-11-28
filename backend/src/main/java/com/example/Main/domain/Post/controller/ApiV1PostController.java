package com.example.Main.domain.Post.controller;

import com.example.Main.domain.Member.entity.Member;
import com.example.Main.domain.Member.service.MemberService;
import com.example.Main.domain.Post.dto.PostDTO;
import com.example.Main.domain.Post.dto.request.PostCreateRequest;
import com.example.Main.domain.Post.dto.request.PostLikeDTO;
import com.example.Main.domain.Post.dto.request.PostModifyRequest;
import com.example.Main.domain.Post.dto.response.PostCreateResponse;
import com.example.Main.domain.Post.dto.response.PostModifyResponse;
import com.example.Main.domain.Post.dto.response.PostResponse;
import com.example.Main.domain.Post.dto.response.PostsResponse;
import com.example.Main.domain.Post.entity.Post;
import com.example.Main.domain.Post.service.PostService;
import com.example.Main.global.Util.Markdown.MarkdownService;
import com.example.Main.global.RsData.RsData;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/api/v1/post")
public class ApiV1PostController {
    private final PostService postService;
    private final MemberService memberService;
    private final MarkdownService markdownService;

    @GetMapping("/search")
    public RsData<PostsResponse> search(@RequestParam("keyword") String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return RsData.of("400", "검색어를 입력해 주세요.", null);
        }
        List<PostDTO> postDTOS = postService.searchPosts(keyword);
        if (postDTOS.isEmpty()) {
            return RsData.of("404", "검색 결과가 없습니다.", null);
        }
        return RsData.of("200", "검색 성공", new PostsResponse(postDTOS));
    }


    @GetMapping("") // 다건조회
    public RsData<PostsResponse> list() {
        List<PostDTO> postDTOS = this.postService.getList();
        return RsData.of("200", "게시글 다건 조회 성공", new PostsResponse(postDTOS));
    }

    @GetMapping("/{id}") // 단건조회
    public RsData<PostResponse> getPost(@PathVariable("id") Long id) {
        Post post = this.postService.getPost(id);

        if (post == null || post.getIsDraft())  // 임시 저장된 게시글은 조회할 수 없음
            return RsData.of("500", "%d 번 게시물은 존재하지 않거나 임시 저장된 게시물입니다.".formatted(id), null);

        PostDTO postDTO = new PostDTO(post);
        return RsData.of("200", "게시글 단건 조회 성공", new PostResponse(postDTO));
    }

    @PostMapping("") // 생성
    public RsData<PostCreateResponse> create(@Valid @RequestBody PostCreateRequest postCreateRequest) {
        String htmlContent = markdownService.convertMarkdownToHtml(postCreateRequest.getContent());

        Post post = this.postService.write(
                postCreateRequest.getSubject(),
                htmlContent,
                postCreateRequest.getAuthor(),
                postCreateRequest.getIsDraft()
        );

        return RsData.of("200", "게시글 등록 성공", new PostCreateResponse(post));
    }

    @PatchMapping("/{id}") // 수정
    public RsData<PostModifyResponse> modify(@PathVariable("id") Long id, @Valid @RequestBody PostModifyRequest postModifyRequest) {
        Post post = this.postService.getPost(id);

        if (post == null || post.getIsDraft())  // 임시 저장된 게시글은 수정할 수 없음
            return RsData.of("500", "%d 번 게시물은 존재하지 않거나 임시 저장된 게시물입니다.".formatted(id), null);

        String htmlContent = markdownService.convertMarkdownToHtml(postModifyRequest.getContent());

        post = this.postService.update(post, htmlContent, postModifyRequest.getSubject(), postModifyRequest.getAuthor(), postModifyRequest.getIsDraft());

        return RsData.of("200", "게시글 수정 성공", new PostModifyResponse(post));
    }

    @DeleteMapping("/{id}") // 삭제
    public RsData<PostResponse> delete(@PathVariable("id") Long id) {
        Post post = this.postService.getPost(id);

        if (post == null)
            return RsData.of("500", "%d 번 게시물은 존재하지 않습니다.".formatted(id), null);

        this.postService.delete(post);
        PostDTO postDTO = new PostDTO(post);
        return RsData.of("200", "%d 번 게시물 삭제 성공".formatted(id), new PostResponse(postDTO));
    }

    // 임시 저장된 게시물 목록 조회
    @GetMapping("/drafts")
    public RsData<PostsResponse> getDrafts() {
        List<PostDTO> draftPosts = this.postService.getDrafts();

        if (draftPosts.isEmpty()) {
            return RsData.of("404", "임시 저장된 게시물이 없습니다.", null);
        }

        return RsData.of("200", "임시 저장된 게시글 목록 조회 성공", new PostsResponse(draftPosts));
    }

    // 임시 저장된 게시글 이어서 작성
    @PatchMapping("/draft/{id}")
    public RsData<PostModifyResponse> continueDraft(@PathVariable("id") Long id, @Valid @RequestBody PostModifyRequest postModifyRequest) {
        Post post = this.postService.getPost(id);

        if (post == null || !post.getIsDraft()) {
            return RsData.of("404", "%d 번 임시 저장 게시물이 존재하지 않거나, 삭제되었습니다.".formatted(id), null);
        }

        String htmlContent = markdownService.convertMarkdownToHtml(postModifyRequest.getContent());

        post = this.postService.continueDraft(
                id,
                htmlContent,
                postModifyRequest.getSubject(),
                postModifyRequest.getAuthor(),
                postModifyRequest.getIsDraft()
        );

        return RsData.of("200", "임시 저장된 게시글 이어서 작성 성공", new PostModifyResponse(post));
    }

    // 임시 저장된 게시물 삭제
    @DeleteMapping("/draft/{id}")
    public RsData<PostResponse> deleteDraft(@PathVariable("id") Long id) {
        Post post = this.postService.getPost(id);

        if (post == null || !post.getIsDraft()) {
            return RsData.of("404", "%d 번 임시 저장 게시물이 존재하지 않습니다.".formatted(id), null);
        }

        this.postService.deleteDraft(id);
        return RsData.of("200", "%d 번 임시 저장 게시물 삭제 성공".formatted(id), null);
    }

    @PostMapping("/{id}/like") // 좋아요
    public RsData<PostResponse> like(@PathVariable("id") Long id, @RequestBody PostLikeDTO postLikeDTO) {
        Post post = this.postService.getPost(id);

        if (post == null || post.getIsDraft()) {
            return RsData.of("500", "%d 번 게시물은 존재하지 않거나 임시 저장된 게시물입니다.".formatted(id), null);
        }

        Member member = memberService.getMemberByEmail(postLikeDTO.getMemberEmail());

        boolean isLiked = post.getLikedByMembers().contains(member);
        if (isLiked) {
            // 좋아요 취소
            this.postService.unlikePost(id, postLikeDTO.getMemberEmail());
            return RsData.of("200", "%d 번 게시물의 좋아요가 취소되었습니다.".formatted(id), new PostResponse(new PostDTO(post)));
        } else {
            // 좋아요
            this.postService.likePost(id, postLikeDTO.getMemberEmail());
            return RsData.of("200", "%d 번 게시물에 좋아요 성공".formatted(id), new PostResponse(new PostDTO(post)));
        }
    }
}
