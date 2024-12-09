package com.example.Main.domain.QnA.Comment.controller;

import com.example.Main.domain.QnA.Comment.dto.QnACommentDTO;
import com.example.Main.domain.QnA.Comment.dto.request.QnACommentCreateRequest;
import com.example.Main.domain.QnA.Comment.dto.request.QnACommentModifyRequest;
import com.example.Main.domain.QnA.Comment.entity.QnAComment;
import com.example.Main.domain.QnA.Comment.service.QnACommentService;
import com.example.Main.domain.QnA.entity.QnA;
import com.example.Main.domain.QnA.service.QnAService;
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
@RequestMapping(value = "/api/v1/qna/{qnAId}/comments")
public class ApiV1QnAReplyController {

    private final QnACommentService commentService;
    private final QnAService qnAService;

    // 대댓글 조회
    @GetMapping("/{commentId}/replies")
    public RsData<List<QnACommentDTO>> getReplies(@PathVariable("qnAId") Long qnAId, @PathVariable("commentId") Long commentId) {

        QnA qna = qnAService.getQnA(qnAId);
        if (qna == null) {
            return RsData.of("404", ErrorMessages.QNA_NOT_FOUND, null);
        }

        List<QnACommentDTO> replies = commentService.getRepliesByParentCommentId(commentId);

        if (replies.isEmpty()) {
            return RsData.of("404", ErrorMessages.NO_REPLIES, null);
        }

        return RsData.of("200", "대댓글 조회 성공", replies);
    }

    // 대댓글 단건 조회
    @GetMapping("/{commentId}/replies/{replyId}")
    public RsData<QnACommentDTO> getReply(@PathVariable("qnAId") Long qnAId, @PathVariable("commentId") Long commentId,
                                          @PathVariable("replyId") Long replyId) {

        QnA qna = qnAService.getQnA(qnAId);
        if (qna == null) {
            return RsData.of("404", ErrorMessages.QNA_NOT_FOUND, null);
        }

        QnAComment parentComment = commentService.getComment(commentId).orElse(null);
        if (parentComment == null) {
            return RsData.of("404", ErrorMessages.REPLY_PARENT_COMMENT_NOT_FOUND, null);
        }

        QnAComment reply = commentService.getComment(replyId).orElse(null);
        if (reply == null || !reply.getParentComment().getId().equals(commentId)) {
            return RsData.of("404", ErrorMessages.REPLY_ID_MISMATCH, null);
        }

        if (!qna.getId().equals(reply.getQnA().getId())) {
            return RsData.of("404", ErrorMessages.QNA_ID_MISMATCH, null);
        }

        return RsData.of("200", "대댓글 조회 성공", new QnACommentDTO(reply));
    }

    // 특정 댓글의 본인이 작성한 대댓글 조회
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/{commentId}/myreplies")
    public RsData<List<QnACommentDTO>> getMyReplies(@PathVariable("qnAId") Long qnAId, @PathVariable("commentId") Long commentId, Principal principal) {
        if (principal == null) {
            return RsData.of("401", ErrorMessages.UNAUTHORIZED, null);
        }

        String loggedInUserEmail = principal.getName();

        QnA qna = qnAService.getQnA(qnAId);
        if (qna == null) {
            return RsData.of("404", ErrorMessages.QNA_NOT_FOUND, null);
        }

        QnAComment parentComment = commentService.getComment(commentId).orElse(null);
        if (parentComment == null) {
            return RsData.of("404", ErrorMessages.REPLY_PARENT_COMMENT_NOT_FOUND, null);
        }

        List<QnACommentDTO> myReplies = commentService.getRepliesByUserAndParentCommentId(loggedInUserEmail, commentId);
        myReplies.removeIf(reply -> !reply.getQnAId().equals(qnAId));

        if (myReplies.isEmpty()) {
            return RsData.of("404", ErrorMessages.REPLY_NO_USERS, null);
        }

        return RsData.of("200", "본인이 작성한 대댓글 조회 성공", myReplies);
    }

    // 대댓글 작성
    @PreAuthorize("isAuthenticated()")
    @PostMapping("/{commentId}/replies")
    public RsData<QnACommentDTO> postReplyCreate(@PathVariable("qnAId") Long qnAId, @PathVariable("commentId") Long commentId,
                                                 @Valid @RequestBody QnACommentCreateRequest commentCreateRequest,
                                                 Principal principal) {
        if (principal == null) {
            return RsData.of("401", ErrorMessages.UNAUTHORIZED, null);
        }

        String userEmail = principal.getName();
        Long parentCommentId = commentId;
        String content = commentCreateRequest.getContent();

        QnA qna = qnAService.getQnA(qnAId);
        if (qna == null) {
            return RsData.of("404", ErrorMessages.QNA_NOT_FOUND, null);
        }

        QnAComment parentComment = commentService.getComment(parentCommentId).orElse(null);
        if (parentComment == null) {
            return RsData.of("404", ErrorMessages.REPLY_PARENT_COMMENT_NOT_FOUND, null);
        }

        if (!parentComment.getQnA().getId().equals(qnAId)) {
            return RsData.of("404", ErrorMessages.COMMENT_NOT_BELONG_TO_QNA, null);
        }

        QnAComment replyComment = commentService.addComment(qnAId, userEmail, content, parentCommentId);

        if (replyComment == null || !replyComment.getQnA().getId().equals(qnAId)) {
            return RsData.of("404", ErrorMessages.INVALID_COMMENT_OPERATION, null);
        }

        return RsData.of("201", "대댓글 작성 성공", new QnACommentDTO(replyComment));
    }

    // 대댓글 수정
    @PreAuthorize("isAuthenticated()")
    @PatchMapping("/{commentId}/replies/{replyId}")
    public RsData<QnACommentDTO> modifyReply(@PathVariable("qnAId") Long qnAId, @PathVariable("commentId") Long commentId,
                                             @PathVariable("replyId") Long replyId,
                                             @Valid @RequestBody QnACommentModifyRequest commentModifyRequest,
                                             Principal principal) {
        if (principal == null) {
            return RsData.of("401", ErrorMessages.UNAUTHORIZED, null);
        }

        String loggedInUserEmail = principal.getName();

        QnA qna = qnAService.getQnA(qnAId);
        if (qna == null) {
            return RsData.of("404", ErrorMessages.QNA_NOT_FOUND, null);
        }

        QnAComment parentComment = commentService.getComment(commentId).orElse(null);
        if (parentComment == null) {
            return RsData.of("404", ErrorMessages.REPLY_PARENT_COMMENT_NOT_FOUND, null);
        }

        QnAComment reply = commentService.getComment(replyId).orElse(null);
        if (reply == null || !reply.getParentComment().getId().equals(commentId)) {
            return RsData.of("404", ErrorMessages.REPLY_ID_MISMATCH, null);
        }

        if (!qna.getId().equals(reply.getQnA().getId())) {
            return RsData.of("404", ErrorMessages.QNA_ID_MISMATCH, null);
        }

        if (!reply.getAuthor().getEmail().equals(loggedInUserEmail)) {
            return RsData.of("403", ErrorMessages.REPLY_CANNOT_BE_MODIFIED, null);
        }

        reply = commentService.updateComment(replyId, commentModifyRequest.getContent(), loggedInUserEmail);
        return RsData.of("200", "대댓글 수정 성공", new QnACommentDTO(reply));
    }

    // 대댓글 삭제
    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/{commentId}/replies/{replyId}")
    public RsData<String> deleteReply(@PathVariable("qnAId") Long qnAId,
                                      @PathVariable("commentId") Long commentId,
                                      @PathVariable("replyId") Long replyId,
                                      Principal principal) {
        if (principal == null) {
            return RsData.of("401", ErrorMessages.UNAUTHORIZED, null);
        }

        String loggedInUser = principal.getName();

        QnA qna = qnAService.getQnA(qnAId);
        if (qna == null) {
            return RsData.of("404", ErrorMessages.QNA_NOT_FOUND, null);
        }

        QnAComment parentComment = commentService.getComment(commentId).orElse(null);
        if (parentComment == null) {
            return RsData.of("404", ErrorMessages.REPLY_PARENT_COMMENT_NOT_FOUND, null);
        }

        QnAComment reply = commentService.getComment(replyId).orElse(null);
        if (reply == null || !reply.getParentComment().getId().equals(commentId)) {
            return RsData.of("404", ErrorMessages.REPLY_ID_MISMATCH, null);
        }

        if (!qna.getId().equals(reply.getQnA().getId())) {
            return RsData.of("404", ErrorMessages.QNA_ID_MISMATCH, null);
        }

        if (!reply.getAuthor().getEmail().equals(loggedInUser)) {
            return RsData.of("403", ErrorMessages.REPLY_CANNOT_BE_DELETED, null);
        }

        if (commentService.hasReplies(reply)) {
            return RsData.of("400", ErrorMessages.COMMENT_HAS_REPLIES, null);
        }

        commentService.deleteComment(replyId);
        return RsData.of("200", "%d 번 대댓글 삭제 성공".formatted(replyId), null);
    }
}
