package com.example.Main.domain.Post.controller;

import com.example.Main.domain.Post.dto.PostDTO;
import com.example.Main.domain.Post.dto.response.PostResponse;
import com.example.Main.domain.Post.entity.Post;
import com.example.Main.domain.Post.service.PostService;
import com.example.Main.global.ErrorMessages.ErrorMessages;
import com.example.Main.global.RsData.RsData;
import com.example.Main.global.Security.SecurityMember;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/api/v1/admin/posts")
public class ApiV1AdminPostController {
    private final PostService postService;

    @PreAuthorize("isAuthenticated()")
    @GetMapping("")
    public RsData<Page<PostDTO>> postList(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @AuthenticationPrincipal SecurityMember loggedInUser
    ) {
        if (loggedInUser == null) {
            return RsData.of("401", ErrorMessages.UNAUTHORIZED, null);
        }

        String role = loggedInUser.getAuthorities().toString();
        if (!role.contains("ROLE_ADMIN")) {
            return RsData.of("403", ErrorMessages.ONLY_ADMIN, null);
        }

        Page<PostDTO> posts = this.postService.getAdminPostList(page, size);
        return RsData.of("200", "게시글 리스트 조회 성공", posts);
    }

    // 관리자용 게시글 삭제
    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/{id}")
    public RsData<PostResponse> deletePostByAdmin(@PathVariable("id") Long id, @AuthenticationPrincipal SecurityMember loggedInUser) {
        if (loggedInUser == null) {
            return RsData.of("401", ErrorMessages.UNAUTHORIZED, null);
        }

        String role = loggedInUser.getAuthorities().toString();
        if (!role.contains("ROLE_ADMIN")) {
            return RsData.of("403", ErrorMessages.ONLY_ADMIN, null);
        }

        Post post = this.postService.getPost(id);

        if (post == null || post.getIsDraft()) {
            return RsData.of("404", "%d 번 게시물은 존재하지 않거나 임시 저장된 게시물입니다.".formatted(id), null);
        }

        this.postService.deletePostByAdmin(id);

        PostDTO postDTO = new PostDTO(post);
        return RsData.of("200", "%d 번 게시물 삭제 성공 (관리자 삭제)".formatted(id), new PostResponse(postDTO));
    }
}
