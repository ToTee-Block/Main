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
import com.example.Main.global.Security.SecurityMember;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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

        if (post == null || post.getIsDraft())
            return RsData.of("500", "%d 번 게시물은 존재하지 않거나 임시 저장된 게시물입니다.".formatted(id), null);

        PostDTO postDTO = new PostDTO(post);
        return RsData.of("200", "게시글 단건 조회 성공", new PostResponse(postDTO));
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("") // 게시글 생성
    public RsData<PostCreateResponse> create(@Valid @RequestBody PostCreateRequest postCreateRequest,
                                             @AuthenticationPrincipal SecurityMember loggedInUser) {
        if (loggedInUser == null) {
            return RsData.of("401", "로그인이 필요합니다.", null);
        }

        String htmlContent = markdownService.convertMarkdownToHtml(postCreateRequest.getContent());

        Post post = postService.write(
                postCreateRequest.getSubject(),
                htmlContent,
                loggedInUser.getEmail(),  // 로그인한 사용자의 이메일을 작성자로 설정
                postCreateRequest.getIsDraft()
        );

        return RsData.of("200", "게시글 등록 성공", new PostCreateResponse(post));
    }

    // 게시글 수정
    @PreAuthorize("isAuthenticated()")
    @PatchMapping("/{id}")
    public RsData<PostModifyResponse> modify(@PathVariable("id") Long id, @Valid @RequestBody PostModifyRequest postModifyRequest,
                                             @AuthenticationPrincipal SecurityMember loggedInUser) {
        Post post = this.postService.getPost(id);

        if (post == null || post.getIsDraft()) {
            return RsData.of("500", "%d 번 게시물은 존재하지 않거나 임시 저장된 게시물입니다.".formatted(id), null);
        }

        if (!post.getAuthor().getEmail().equals(loggedInUser.getEmail())) {
            return RsData.of("403", "본인만 게시글을 수정할 수 있습니다.", null);
        }

        String htmlContent = markdownService.convertMarkdownToHtml(postModifyRequest.getContent());

        post = this.postService.update(post, htmlContent, postModifyRequest.getSubject(), loggedInUser.getEmail(), postModifyRequest.getIsDraft());

        return RsData.of("200", "게시글 수정 성공", new PostModifyResponse(post));
    }

    // 게시글 삭제
    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/{id}")
    public RsData<PostResponse> delete(@PathVariable("id") Long id, @AuthenticationPrincipal SecurityMember loggedInUser) {
        Post post = this.postService.getPost(id);

        if (post == null || post.getIsDraft()) {
            return RsData.of("500", "%d 번 게시물은 존재하지 않거나 임시 저장된 게시물입니다.".formatted(id), null);
        }

        if (!post.getAuthor().getEmail().equals(loggedInUser.getEmail())) {
            return RsData.of("403", "본인만 게시글을 삭제할 수 있습니다.", null);
        }

        this.postService.delete(post);
        PostDTO postDTO = new PostDTO(post);
        return RsData.of("200", "%d 번 게시물 삭제 성공".formatted(id), new PostResponse(postDTO));
    }

    // 임시 저장된 게시물 목록 전체 조회
    @GetMapping("/draftsAll")
    public RsData<PostsResponse> getDrafts() {
        List<PostDTO> draftPosts = this.postService.getDrafts();

        if (draftPosts.isEmpty()) {
            return RsData.of("404", "임시 저장된 게시물이 없습니다.", null);
        }

        return RsData.of("200", "임시 저장된 게시글 목록 조회 성공", new PostsResponse(draftPosts));
    }

    // 임시 저장된 게시물 목록 조회
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/drafts")
    public RsData<PostsResponse> getDrafts(@AuthenticationPrincipal SecurityMember loggedInUser) {
        List<PostDTO> draftPosts = this.postService.getDraftsByAuthor(loggedInUser.getEmail());

        if (draftPosts.isEmpty()) {
            return RsData.of("404", "임시 저장된 게시물이 없습니다.", null);
        }

        return RsData.of("200", "임시 저장된 게시글 목록 조회 성공", new PostsResponse(draftPosts));
    }


    // 임시 저장된 게시글 이어서 작성
    @PreAuthorize("isAuthenticated()")
    @PatchMapping("/draft/{id}")
    public RsData<PostModifyResponse> continueDraft(@PathVariable("id") Long id, @Valid @RequestBody PostModifyRequest postModifyRequest,
                                                    @AuthenticationPrincipal SecurityMember loggedInUser) {
        Post post = this.postService.getPost(id);

        if (post == null || !post.getIsDraft()) {
            return RsData.of("404", "%d 번 임시 저장 게시물이 존재하지 않거나, 삭제되었습니다.".formatted(id), null);
        }

        if (!post.getAuthor().getEmail().equals(loggedInUser.getEmail())) {
            return RsData.of("403", "본인만 임시 저장 게시글을 이어서 작성할 수 있습니다.", null);
        }

        String htmlContent = markdownService.convertMarkdownToHtml(postModifyRequest.getContent());

        post = this.postService.continueDraft(
                id,
                htmlContent,
                postModifyRequest.getSubject(),
                loggedInUser.getEmail(),
                postModifyRequest.getIsDraft()
        );

        return RsData.of("200", "임시 저장된 게시글 이어서 작성 성공", new PostModifyResponse(post));
    }

    // 임시 저장된 게시물 삭제
    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/draft/{id}")
    public RsData<PostResponse> deleteDraft(@PathVariable("id") Long id, @AuthenticationPrincipal SecurityMember loggedInUser) {
        Post post = this.postService.getPost(id);

        if (post == null || !post.getIsDraft()) {
            return RsData.of("404", "%d 번 임시 저장 게시물이 존재하지 않습니다.".formatted(id), null);
        }

        if (!post.getAuthor().getEmail().equals(loggedInUser.getEmail())) {
            return RsData.of("403", "본인만 임시 저장 게시물을 삭제할 수 있습니다.", null);
        }

        this.postService.deleteDraft(id);
        return RsData.of("200", "%d 번 임시 저장 게시물 삭제 성공".formatted(id), null);
    }

    // 좋아요
    @PostMapping("/{id}/like")
    public RsData<PostResponse> like(@PathVariable("id") Long id,
                                     @RequestBody PostLikeDTO postLikeDTO,
                                     @AuthenticationPrincipal SecurityMember loggedInUser) {

        // 로그인하지 않은 경우
        if (loggedInUser == null) {
            return RsData.of("401", "로그인 후 사용 가능합니다.", null);
        }

        // 게시글 조회
        Post post = this.postService.getPost(id);

        // 게시글이 없거나 임시 저장 상태일 경우 처리
        if (post == null || post.getIsDraft()) {
            return RsData.of("500", "%d 번 게시물은 존재하지 않거나 임시 저장된 게시물입니다.".formatted(id), null);
        }

        // 로그인한 사용자의 이메일을 사용하여 좋아요 상태 확인
        String loggedInUserEmail = loggedInUser.getEmail();  // 로그인한 사용자의 이메일

        // 좋아요 상태 확인
        Member member = memberService.getMemberByEmail(loggedInUserEmail);
        boolean isLiked = post.getLikedByMembers().contains(member);

        if (isLiked) {
            // 좋아요 취소
            this.postService.unlikePost(id, loggedInUserEmail);
            return RsData.of("200", "%d 번 게시물의 좋아요가 취소되었습니다.".formatted(id), new PostResponse(new PostDTO(post)));
        } else {
            // 좋아요
            this.postService.likePost(id, loggedInUserEmail);
            return RsData.of("200", "%d 번 게시물에 좋아요 성공".formatted(id), new PostResponse(new PostDTO(post)));
        }
    }


}