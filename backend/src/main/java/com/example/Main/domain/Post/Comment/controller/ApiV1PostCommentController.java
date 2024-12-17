package com.example.Main.domain.Post.Comment.controller;

import com.example.Main.domain.Member.entity.Member;
import com.example.Main.domain.Member.service.MemberService;
import com.example.Main.domain.Post.Comment.dto.PostCommentDTO;
import com.example.Main.domain.Post.Comment.dto.request.PostCommentCreateRequest;
import com.example.Main.domain.Post.Comment.dto.request.PostCommentModifyRequest;
import com.example.Main.domain.Post.Comment.dto.response.PostCommentCreateResponse;
import com.example.Main.domain.Post.Comment.dto.response.PostCommentResponse;
import com.example.Main.domain.Post.Comment.dto.response.PostCommentsResponse;
import com.example.Main.domain.Post.Comment.entity.PostComment;
import com.example.Main.domain.Post.Comment.service.PostCommentService;
import com.example.Main.domain.Post.entity.Post;
import com.example.Main.domain.Post.service.PostService;
import com.example.Main.global.ErrorMessages.ErrorMessages;
import com.example.Main.global.RsData.RsData;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/api/v1/posts/{postId}/comments")
public class ApiV1PostCommentController {

    private final PostCommentService commentService;
    private final MemberService memberService;
    private final PostService postService;

    // 특정 게시글의 댓글 목록 조회 (다건 조회)
    @GetMapping
    public RsData<PostCommentsResponse> getComments(@PathVariable("postId") Long postId) {
        Post post = postService.getPost(postId);
        if (post == null) {
            return RsData.of("404", com.example.Main.global.ErrorMessages.ErrorMessages.POST_NOT_FOUND, null);
        }

        List<PostCommentDTO> comments = commentService.getCommentsByPostId(postId);
        if (comments.isEmpty()) {
            return RsData.of("404", ErrorMessages.NO_COMMENTS, null);
        }

        return RsData.of("200", "댓글 조회 성공 (게시글 제목: " + post.getSubject() + ")", new PostCommentsResponse(comments));
    }

    // 특정 게시글의 댓글 조회 (단건 조회)
    @GetMapping("/{commentId}")
    public RsData<PostCommentDTO> getComment(@PathVariable("postId") Long postId, @PathVariable("commentId") Long commentId) {
        Post post = postService.getPost(postId);
        if (post == null) {
            return RsData.of("404", ErrorMessages.POST_NOT_FOUND, null);
        }

        PostComment comment = commentService.getComment(commentId).orElse(null);
        if (comment == null || !comment.getPost().getId().equals(postId)) {
            return RsData.of("404", ErrorMessages.COMMENT_ID_MISMATCH, null);
        }

        return RsData.of("200", "댓글 조회 성공 (게시글 제목: " + post.getSubject() + ")", new PostCommentDTO(comment));
    }

    // 특정 게시글의 본인의 댓글 조회
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/mycomments")
    public RsData<PostCommentsResponse> getMyPostComments(@PathVariable("postId") Long postId, Principal principal) {
        if (principal == null) {
            return RsData.of("401", ErrorMessages.UNAUTHORIZED, null);
        }

        String loggedInUserEmail = principal.getName();
        Post post = postService.getPost(postId);
        if (post == null) {
            return RsData.of("404", ErrorMessages.POST_NOT_FOUND, null);
        }

        List<PostCommentDTO> myPostComments = commentService.getPostsCommentsByUserAndPostId(loggedInUserEmail, postId);
        if (myPostComments.isEmpty()) {
            return RsData.of("404", ErrorMessages.NO_COMMENTS, null);
        }

        return RsData.of("200", "본인이 작성한 댓글 조회 성공", new PostCommentsResponse(myPostComments));
    }

    // 게시글 댓글 작성
    @PreAuthorize("isAuthenticated()")
    @PostMapping
    public RsData<PostCommentCreateResponse> postCommentCreate(@PathVariable("postId") Long postId,
                                                               @Valid @RequestBody PostCommentCreateRequest commentCreateRequest,
                                                               Principal principal) {
        if (principal == null) {
            return RsData.of("401", ErrorMessages.UNAUTHORIZED);
        }

        Member author = this.memberService.getMemberByEmail(principal.getName());
        if (author == null) {
            return RsData.of("401", "존재하는 사용자가 아닙니다.");
        }

        Post post = this.postService.getPost(postId);
        if (post == null) {
            return RsData.of("400", ErrorMessages.POST_NOT_EXIST);
        }

        PostComment comment = commentService.addComment(commentCreateRequest.getContent(), post, author);

        return RsData.of("201", "댓글 작성 성공", new PostCommentCreateResponse(comment));
    }

    // 게시글 댓글 수정
    @PreAuthorize("isAuthenticated()")
    @PatchMapping("/{commentId}")
    public RsData<PostCommentCreateResponse> postCommentModify(@PathVariable("postId") Long postId, @PathVariable("commentId") Long commentId, @Valid @RequestBody PostCommentModifyRequest commentModifyRequest, Principal principal) {
        if (principal == null) {
            return RsData.of("401", ErrorMessages.UNAUTHORIZED, null);
        }

        String userEmail = principal.getName();
        PostComment comment = commentService.getComment(commentId).orElse(null);

        if (comment == null) {
            return RsData.of("404", ErrorMessages.COMMENT_NOT_FOUND, null);
        }

        if (!comment.getPost().getId().equals(postId)) {
            return RsData.of("404", ErrorMessages.POST_ID_MISMATCH, null);
        }

        if (!comment.getAuthor().getEmail().equals(userEmail)) {
            return RsData.of("403", ErrorMessages.FORBIDDEN, null);
        }

        comment = commentService.updateComment(commentId, commentModifyRequest.getContent(), userEmail);

        return RsData.of("200", "댓글 수정 성공", new PostCommentCreateResponse(comment));
    }

    // 게시글 댓글 삭제
    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/{commentId}")
    public RsData<String> deleteComment(@PathVariable("postId") Long postId,
                                        @PathVariable("commentId") Long commentId,
                                        Principal principal) {
        if (principal == null) {
            return RsData.of("401", ErrorMessages.UNAUTHORIZED, null);
        }

        String loggedInUser = principal.getName();
        PostComment comment = commentService.getComment(commentId).orElse(null);

        if (comment == null) {
            return RsData.of("404", ErrorMessages.COMMENT_NOT_FOUND, null);
        }

        if (!comment.getPost().getId().equals(postId)) {
            return RsData.of("404", ErrorMessages.POST_ID_MISMATCH, null);
        }

        if (!comment.getAuthor().getEmail().equals(loggedInUser)) {
            return RsData.of("403", ErrorMessages.FORBIDDEN, null);
        }

        commentService.deleteComment(commentId);
        return RsData.of("200", "%d 번 댓글 삭제 성공".formatted(commentId), null);
    }

    // 게시글 댓글 좋아요
    @PostMapping("/{commentId}/like")
    public RsData<PostCommentResponse> like(@PathVariable("postId") Long postId, @PathVariable("commentId") Long commentId,
                                            Principal principal) {
        if (principal == null) {
            return RsData.of("401", ErrorMessages.UNAUTHORIZED, null);
        }

        String loggedInUser = principal.getName();
        PostComment comment = commentService.getComment(commentId).orElse(null);

        if (comment == null) {
            return RsData.of("404", ErrorMessages.COMMENT_NOT_FOUND, null);
        }

        if (!comment.getPost().getId().equals(postId)) {
            return RsData.of("404", ErrorMessages.COMMENT_ID_MISMATCH, null);
        }

        Member member = memberService.getMemberByEmail(loggedInUser);
        boolean isLiked = comment.getLikedByMembers().contains(member);

        if (isLiked) {
            commentService.unlikeComment(commentId, loggedInUser);
            return RsData.of("200", "댓글 좋아요 취소", new PostCommentResponse(new PostCommentDTO(comment)));
        } else {
            commentService.likeComment(commentId, loggedInUser);
            return RsData.of("200", "댓글 좋아요 성공", new PostCommentResponse(new PostCommentDTO(comment)));
        }
    }
}
