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
import com.example.Main.domain.TechStack.enums.TechStacks;
import com.example.Main.global.RsData.RsData;
import com.example.Main.global.Security.SecurityMember;
import com.example.Main.global.Util.Markdown.MarkdownService;
import com.example.Main.global.ErrorMessages.ErrorMessages;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.*;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/api/v1/posts")
public class ApiV1PostController {
    private final PostService postService;
    private final MemberService memberService;
    private final MarkdownService markdownService;

    // 다건조회 - ver.전체
    @GetMapping("")
    public RsData list(@RequestParam(value = "page", defaultValue = "0")int page,
                       @RequestParam(value = "size", defaultValue = "10") int size,
                       @RequestParam(value = "kw", defaultValue = "") String keyword) {
        Page<PostDTO> recentPosts = this.postService.searchRecentPosts(page, size, keyword);
        Page<PostDTO> hotPosts = this.postService.searchHotPosts(page, size, keyword);
        Page<PostDTO> feedPosts = this.postService.searchHotPosts(page, size, keyword);

        List<Page> postPackage = new ArrayList<>();
        postPackage.add(recentPosts);
        postPackage.add(hotPosts);
        postPackage.add(feedPosts);

        return RsData.of("200", "게시글 다건 조회 성공", postPackage);
    }

    // 다건조회 - ver.특정사용자
    @GetMapping("/{authorEmail}")
    public RsData getMyPosts(@RequestParam(value = "page", defaultValue = "0")int page,
                             @RequestParam(value = "size", defaultValue = "10") int size,
                             @RequestParam(value = "kw", defaultValue = "") String keyword,
                             @PathVariable(value = "authorEmail") String authorEmail) {
        Member author = this.memberService.getMemberByEmail(authorEmail);
        if (author == null) {
            return RsData.of("400", "존재하지 않는 사용자입니다.");
        }

        Map<String, Object> returnMap = new HashMap<>();

        List<String> wholeTechStacks = TechStacks.printAllTechStacks();
        Page<PostDTO> entirePosts = postService.searchPostsByAuthor(page, size, keyword, author);

        returnMap.put("stacks", wholeTechStacks);
        returnMap.put("posts", entirePosts);


        return RsData.of("200", "본인이 작성한 게시글 조회 성공", returnMap);
    }

    // 단건조회
    @GetMapping("/detail/{id}")
    public RsData<PostResponse> getPost(@PathVariable("id") Long id) {
        Post post = this.postService.getPost(id);

        if (post == null || post.getIsDraft()) {
            return RsData.of("404", "%d 번 게시물은 존재하지 않거나 임시 저장된 게시물입니다.".formatted(id), null);
        }

        PostDTO postDTO = new PostDTO(post);
        return RsData.of("200", "게시글 단건 조회 성공", new PostResponse(postDTO));
    }

    // 게시글 생성
    @PreAuthorize("isAuthenticated()")
    @PostMapping("")
    public RsData<PostCreateResponse> create(@Valid @RequestBody PostCreateRequest postCreateRequest,
                                             Principal principal) {
        if (principal == null) {
            return RsData.of("401", ErrorMessages.UNAUTHORIZED, null);
        }

        String loggedInUser = principal.getName();

        String htmlContent = markdownService.convertMarkdownToHtml(postCreateRequest.getContent());

        Post post = postService.write(
                postCreateRequest.getSubject(),
                htmlContent,
                loggedInUser,  // 로그인한 사용자의 이메일을 작성자로 설정
                postCreateRequest.getIsDraft()
        );

        return RsData.of("200", "게시글 등록 성공", new PostCreateResponse(post));
    }

    // 게시글 수정
    @PreAuthorize("isAuthenticated()")
    @PatchMapping("/{id}")
    public RsData<PostModifyResponse> modify(@PathVariable("id") Long id, @Valid @RequestBody PostModifyRequest postModifyRequest,
                                             Principal principal) {
        if (principal == null) {
            return RsData.of("401", ErrorMessages.UNAUTHORIZED, null);
        }

        Post post = this.postService.getPost(id);

        if (post == null || post.getIsDraft()) {
            return RsData.of("404", "%d 번 게시물은 존재하지 않거나 임시 저장된 게시물입니다.".formatted(id), null);
        }

        String loggedInUser = principal.getName();
        if (!post.getAuthor().getEmail().equals(loggedInUser)) {
            return RsData.of("403", "본인만 게시글을 수정할 수 있습니다.", null);
        }

        String htmlContent = markdownService.convertMarkdownToHtml(postModifyRequest.getContent());

        post = this.postService.update(post, htmlContent, postModifyRequest.getSubject(), loggedInUser, postModifyRequest.getIsDraft());

        return RsData.of("200", "게시글 수정 성공", new PostModifyResponse(post));
    }

    // 게시글 삭제
    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/{id}")
    public RsData<PostResponse> delete(@PathVariable("id") Long id, Principal principal) {
        if (principal == null) {
            return RsData.of("401", ErrorMessages.UNAUTHORIZED, null);
        }

        Post post = this.postService.getPost(id);

        if (post == null || post.getIsDraft()) {
            return RsData.of("404", "%d 번 게시물은 존재하지 않거나 임시 저장된 게시물입니다.".formatted(id), null);
        }

        String loggedInUser = principal.getName();
        if (!post.getAuthor().getEmail().equals(loggedInUser)) {
            return RsData.of("403", ErrorMessages.POST_NOT_YOUR_OWN, null);
        }

        this.postService.deletePost(id);
        return RsData.of("200", "%d 번 게시물 삭제 성공".formatted(id), null);
    }

    // 임시 저장된 게시물 목록 전체 조회
    @GetMapping("/draftsAll")
    public RsData<PostsResponse> getDrafts() {
        List<PostDTO> draftPosts = this.postService.getDrafts();

        if (draftPosts.isEmpty()) {
            return RsData.of("404", ErrorMessages.NO_DRAFT_POSTS, null);
        }

        return RsData.of("200", "임시 저장된 게시글 목록 조회 성공", new PostsResponse(draftPosts));
    }

    // 임시 저장된 게시물 목록 조회
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/drafts")
    public RsData<PostsResponse> getDrafts(Principal principal) {
        if (principal == null) {
            return RsData.of("401", ErrorMessages.UNAUTHORIZED, null);
        }

        String loggedInUser = principal.getName();
        List<PostDTO> draftPosts = this.postService.getDraftsByAuthor(loggedInUser);

        if (draftPosts.isEmpty()) {
            return RsData.of("404", ErrorMessages.NO_DRAFT_POSTS, null);
        }

        return RsData.of("200", "임시 저장된 게시글 목록 조회 성공", new PostsResponse(draftPosts));
    }

    // 임시 저장된 게시글 이어서 수정 작성
    @PreAuthorize("isAuthenticated()")
    @PatchMapping("/draft/{id}")
    public RsData<PostModifyResponse> continueDraft(@PathVariable("id") Long id, @Valid @RequestBody PostModifyRequest postModifyRequest,
                                                    Principal principal) {
        if (principal == null) {
            return RsData.of("401", ErrorMessages.UNAUTHORIZED, null);
        }

        Post post = this.postService.getPost(id);

        if (post == null || !post.getIsDraft()) {
            return RsData.of("404", "%d 번 임시 저장 게시물이 존재하지 않거나, 삭제되었습니다.".formatted(id), null);
        }

        String loggedInUser = principal.getName();
        if (!post.getAuthor().getEmail().equals(loggedInUser)) {
            return RsData.of("403", ErrorMessages.ONLY_OWN_DRAFT, null);
        }

        String htmlContent = markdownService.convertMarkdownToHtml(postModifyRequest.getContent());

        post = this.postService.continueDraft(
                id,
                htmlContent,
                postModifyRequest.getSubject(),
                loggedInUser,
                postModifyRequest.getIsDraft()
        );

        return RsData.of("200", "임시 저장된 게시글 이어서 작성 성공", new PostModifyResponse(post));
    }

    // 임시 저장된 게시물 삭제
    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/draft/{id}")
    public RsData<PostResponse> deleteDraft(@PathVariable("id") Long id, Principal principal) {
        if (principal == null) {
            return RsData.of("401", ErrorMessages.UNAUTHORIZED, null);
        }

        Post post = this.postService.getPost(id);

        if (post == null || !post.getIsDraft()) {
            return RsData.of("404", "%d 번 임시 저장 게시물이 존재하지 않습니다.".formatted(id), null);
        }

        String loggedInUser = principal.getName();
        if (!post.getAuthor().getEmail().equals(loggedInUser)) {
            return RsData.of("403", ErrorMessages.ONLY_OWN_DRAFT, null);
        }

        this.postService.deleteDraft(id);
        return RsData.of("200", "%d 번 임시 저장 게시물 삭제 성공".formatted(id), null);
    }

    // 좋아요
    @PostMapping("/{id}/like")
    public RsData<PostResponse> like(@PathVariable("id") Long id,
                                     @RequestBody PostLikeDTO postLikeDTO,
                                     Principal principal) {
        if (principal == null) {
            return RsData.of("401", ErrorMessages.UNAUTHORIZED, null);
        }

        String loggedInUser = principal.getName();

        Post post = this.postService.getPost(id);

        if (post == null || post.getIsDraft()) {
            return RsData.of("404", "%d 번 게시물은 존재하지 않거나 임시 저장된 게시물입니다.".formatted(id), null);
        }

        String loggedInUserEmail = loggedInUser;

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
