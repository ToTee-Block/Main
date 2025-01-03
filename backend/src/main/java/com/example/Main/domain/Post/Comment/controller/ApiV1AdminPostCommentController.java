package com.example.Main.domain.Post.Comment.controller;

import com.example.Main.domain.Post.Comment.entity.PostComment;
import com.example.Main.domain.Post.Comment.service.PostCommentService;
import com.example.Main.global.ErrorMessages.ErrorMessages;
import com.example.Main.global.RsData.RsData;
import com.example.Main.global.Security.SecurityMember;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/api/v1/admin/posts/{postId}/comments")
public class ApiV1AdminPostCommentController {

    private final PostCommentService commentService;

    // 관리자용 댓글 삭제
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{commentId}")
    public RsData<String> deleteCommentByAdmin(@PathVariable("commentId") Long commentId, @AuthenticationPrincipal SecurityMember loggedInUser) {
        if (loggedInUser == null) {
            return RsData.of("401", ErrorMessages.UNAUTHORIZED, null);
        }

        String role = loggedInUser.getAuthorities().toString();
        if (!role.contains("ROLE_ADMIN")) {
            return RsData.of("403", ErrorMessages.ONLY_ADMIN, null);
        }

        PostComment comment = commentService.getComment(commentId).orElse(null);

        if (comment == null) {
            return RsData.of("404", ErrorMessages.COMMENT_NOT_FOUND, null);
        }

        commentService.deleteCommentByAdmin(commentId);

        return RsData.of("200", "%d 번 댓글 삭제 성공 (관리자 삭제)".formatted(commentId), null);
    }

}
