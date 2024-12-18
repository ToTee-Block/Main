package com.example.Main.domain.Post.Comment.controller;

import com.example.Main.domain.Post.Comment.dto.PostCommentDTO;
import com.example.Main.domain.Post.Comment.dto.request.PostCommentCreateRequest;
import com.example.Main.domain.Post.Comment.dto.request.PostCommentModifyRequest;
import com.example.Main.domain.Post.Comment.entity.PostComment;
import com.example.Main.domain.Post.Comment.service.PostCommentService;
import com.example.Main.domain.Post.entity.Post;
import com.example.Main.domain.Post.service.PostService;
import com.example.Main.global.RsData.RsData;
import com.example.Main.global.ErrorMessages.ErrorMessages;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/api/v1/posts/{postId}/comments/{commentId}/replies")
public class ApiV1PostReplyController {

    private final PostCommentService commentService;
    private final PostService postService;

    // 대댓글 조회
    @GetMapping
    public RsData<List<PostCommentDTO>> getReplies(@PathVariable("postId") Long postId, @PathVariable("commentId") Long commentId) {

        Post post = postService.getPost(postId);
        if (post == null) {
            return RsData.of("404", ErrorMessages.POST_NOT_FOUND, null);
        }

        List<PostCommentDTO> replies = commentService.getRepliesByParentCommentId(commentId);

        if (replies.isEmpty()) {
            return RsData.of("404", ErrorMessages.NO_REPLIES, null);
        }

        return RsData.of("200", "대댓글 조회 성공", replies);
    }

    // 대댓글 단건 조회
    @GetMapping("/{replyId}")
    public RsData<PostCommentDTO> getReply(@PathVariable("postId") Long postId, @PathVariable("commentId") Long commentId,
                                           @PathVariable("replyId") Long replyId) {

        Post post = postService.getPost(postId);
        if (post == null) {
            return RsData.of("404", ErrorMessages.POST_NOT_FOUND, null);
        }

        PostComment parentComment = commentService.getComment(commentId).orElse(null);
        if (parentComment == null) {
            return RsData.of("404", ErrorMessages.REPLY_PARENT_COMMENT_NOT_FOUND, null);
        }

        PostComment reply = commentService.getComment(replyId).orElse(null);
        if (reply == null || !reply.getParentComment().getId().equals(commentId)) {
            return RsData.of("404", ErrorMessages.REPLY_ID_MISMATCH, null);
        }

        if (!post.getId().equals(reply.getPost().getId())) {
            return RsData.of("404", ErrorMessages.REPLY_NOT_FOUND, null);
        }

        return RsData.of("200", "대댓글 조회 성공", new PostCommentDTO(reply));
    }

    // 본인이 작성한 대댓글 조회
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/myreplies")
    public RsData<List<PostCommentDTO>> getMyReplies(@PathVariable("postId") Long postId, @PathVariable("commentId") Long commentId, Principal principal) {
        if (principal == null) {
            return RsData.of("401", ErrorMessages.UNAUTHORIZED, null);
        }

        String loggedInUserEmail = principal.getName();

        Post post = postService.getPost(postId);
        if (post == null) {
            return RsData.of("404", ErrorMessages.POST_NOT_FOUND, null);
        }

        PostComment parentComment = commentService.getComment(commentId).orElse(null);
        if (parentComment == null) {
            return RsData.of("404", ErrorMessages.REPLY_PARENT_COMMENT_NOT_FOUND, null);
        }

        List<PostCommentDTO> myReplies = commentService.getRepliesByUserAndParentCommentId(loggedInUserEmail, commentId);

        myReplies.removeIf(reply -> !reply.getPostId().equals(postId));

        if (myReplies.isEmpty()) {
            return RsData.of("404", ErrorMessages.REPLY_NO_USERS, null);
        }

        return RsData.of("200", "본인이 작성한 대댓글 조회 성공", myReplies);
    }

    // 대댓글 작성
    @PreAuthorize("isAuthenticated()")
    @PostMapping
    public RsData<PostCommentDTO> postReplyCreate(@PathVariable("postId") Long postId, @PathVariable("commentId") Long commentId,
                                                  @Valid @RequestBody PostCommentCreateRequest commentCreateRequest,
                                                  Principal principal) {
        if (principal == null) {
            return RsData.of("401", ErrorMessages.UNAUTHORIZED, null);
        }

        String userEmail = principal.getName();
        Long parentCommentId = commentId;
        String content = commentCreateRequest.getContent();

        Post post = postService.getPost(postId);
        if (post == null) {
            return RsData.of("404", ErrorMessages.POST_NOT_FOUND, null);
        }

        PostComment parentComment = commentService.getComment(parentCommentId).orElse(null);
        if (parentComment == null) {
            return RsData.of("404", ErrorMessages.REPLY_PARENT_COMMENT_NOT_FOUND, null);
        }

        if (!parentComment.getPost().getId().equals(postId)) {
            return RsData.of("404", ErrorMessages.POST_ID_MISMATCH, null);
        }

        PostComment replyComment = commentService.addComment(postId, userEmail, content, parentCommentId);

        if (replyComment == null || !replyComment.getPost().getId().equals(postId)) {
            return RsData.of("404", ErrorMessages.INVALID_COMMENT_OPERATION, null);
        }

        return RsData.of("201", "대댓글 작성 성공", new PostCommentDTO(replyComment));
    }

    // 대댓글 수정
    @PreAuthorize("isAuthenticated()")
    @PatchMapping("/{replyId}")
    public RsData<PostCommentDTO> modifyReply(@PathVariable("postId") Long postId, @PathVariable("commentId") Long commentId,
                                              @PathVariable("replyId") Long replyId,
                                              @Valid @RequestBody PostCommentModifyRequest commentModifyRequest,
                                              Principal principal) {
        if (principal == null) {
            return RsData.of("401", ErrorMessages.UNAUTHORIZED, null);
        }

        String loggedInUserEmail = principal.getName();

        Post post = postService.getPost(postId);
        if (post == null) {
            return RsData.of("404", ErrorMessages.POST_NOT_FOUND, null);
        }

        PostComment parentComment = commentService.getComment(commentId).orElse(null);
        if (parentComment == null) {
            return RsData.of("404", ErrorMessages.REPLY_PARENT_COMMENT_NOT_FOUND, null);
        }

        PostComment reply = commentService.getComment(replyId).orElse(null);
        if (reply == null || !reply.getParentComment().getId().equals(commentId)) {
            return RsData.of("404", ErrorMessages.REPLY_ID_MISMATCH, null);
        }

        if (!post.getId().equals(reply.getPost().getId())) {
            return RsData.of("404", ErrorMessages.REPLY_NOT_FOUND, null);
        }

        if (!reply.getAuthor().getEmail().equals(loggedInUserEmail)) {
            return RsData.of("403", ErrorMessages.REPLY_CANNOT_BE_MODIFIED, null);
        }

        reply = commentService.updateComment(replyId, commentModifyRequest.getContent(), loggedInUserEmail);
        return RsData.of("200", "대댓글 수정 성공", new PostCommentDTO(reply));
    }

    // 대댓글 삭제
    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/{replyId}")
    public RsData<String> deleteReply(@PathVariable("postId") Long postId,
                                      @PathVariable("commentId") Long commentId,
                                      @PathVariable("replyId") Long replyId,
                                      Principal principal) {
        if (principal == null) {
            return RsData.of("401", ErrorMessages.UNAUTHORIZED, null);
        }

        String loggedInUser = principal.getName();

        Post post = postService.getPost(postId);
        if (post == null) {
            return RsData.of("404", ErrorMessages.POST_NOT_FOUND, null);
        }

        PostComment parentComment = commentService.getComment(commentId).orElse(null);
        if (parentComment == null) {
            return RsData.of("404", ErrorMessages.REPLY_PARENT_COMMENT_NOT_FOUND, null);
        }

        PostComment reply = commentService.getComment(replyId).orElse(null);
        if (reply == null || !reply.getParentComment().getId().equals(commentId)) {
            return RsData.of("404", ErrorMessages.REPLY_ID_MISMATCH, null);
        }

        if (!post.getId().equals(reply.getPost().getId())) {
            return RsData.of("404", ErrorMessages.REPLY_NOT_FOUND, null);
        }

        if (!reply.getAuthor().getEmail().equals(loggedInUser)) {
            return RsData.of("403", ErrorMessages.REPLY_CANNOT_BE_DELETED, null);
        }

        if (commentService.hasReplies(reply)) {
            return RsData.of("400", ErrorMessages.REPLY_CANNOT_BE_DELETED, null);
        }
        commentService.deleteComment(replyId);
        return RsData.of("200", "%d 번 대댓글 삭제 성공".formatted(replyId), null);
    }
}
