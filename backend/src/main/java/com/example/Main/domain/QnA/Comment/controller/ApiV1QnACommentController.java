package com.example.Main.domain.QnA.Comment.controller;

import com.example.Main.domain.Member.entity.Member;
import com.example.Main.domain.Member.service.MemberService;
import com.example.Main.domain.QnA.Comment.dto.QnACommentDTO;
import com.example.Main.domain.QnA.Comment.dto.request.QnACommentCreateRequest;
import com.example.Main.domain.QnA.Comment.dto.request.QnACommentModifyRequest;
import com.example.Main.domain.QnA.Comment.dto.response.QnACommentCreateResponse;
import com.example.Main.domain.QnA.Comment.dto.response.QnACommentModifyResponse;
import com.example.Main.domain.QnA.Comment.dto.response.QnACommentResponse;
import com.example.Main.domain.QnA.Comment.dto.response.QnACommentsResponse;
import com.example.Main.domain.QnA.Comment.entity.QnAComment;
import com.example.Main.domain.QnA.Comment.service.QnACommentService;
import com.example.Main.domain.QnA.entity.QnA;
import com.example.Main.domain.QnA.service.QnAService;
import com.example.Main.domain.notification.service.NotificationService;
import com.example.Main.global.ErrorMessages.ErrorMessages;
import com.example.Main.global.RsData.RsData;
import com.example.Main.global.Security.SecurityMember;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/api/v1/qnas/{qnAId}/comments")
public class ApiV1QnACommentController {

    private final QnACommentService commentService;
    private final MemberService memberService;
    private final QnAService qnAService;
    private final NotificationService notificationService;

    // 특정 QnA의 댓글 목록 조회 (다건 조회)
    @GetMapping
    public RsData<QnACommentsResponse> getComments(@PathVariable("qnAId") Long qnAId) {
        QnA qnA = qnAService.getQnA(qnAId);
        if (qnA == null) {
            return RsData.of("404", ErrorMessages.QNA_NOT_FOUND, null);
        }

        List<QnACommentDTO> comments = commentService.getCommentsByQnAId(qnAId);
        if (comments.isEmpty()) {
            return RsData.of("404", ErrorMessages.NO_COMMENTS, null);
        }

        return RsData.of("200", "댓글 조회 성공 (QnA 제목: " + qnA.getSubject() + ")", new QnACommentsResponse(comments));
    }

    // 특정 QnA의 댓글 조회 (단건 조회)
    @GetMapping("/{commentId}")
    public RsData<QnACommentDTO> getComment(@PathVariable("qnAId") Long qnAId, @PathVariable("commentId") Long commentId) {
        QnA qnA = qnAService.getQnA(qnAId);
        if (qnA == null) {
            return RsData.of("404", ErrorMessages.QNA_NOT_FOUND, null);
        }

        QnAComment comment = commentService.getComment(commentId).orElse(null);
        if (comment == null || !comment.getQnA().getId().equals(qnAId)) {
            return RsData.of("404", ErrorMessages.COMMENT_ID_MISMATCH, null);
        }

        return RsData.of("200", "댓글 조회 성공 (QnA 제목: " + qnA.getSubject() + ")", new QnACommentDTO(comment));
    }

    // 특정 QnA의 본인 댓글 조회
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/mycomments")
    public RsData<QnACommentsResponse> getMyQnAComments(@PathVariable("qnAId") Long qnAId, Principal principal) {
        if (principal == null) {
            return RsData.of("401", ErrorMessages.UNAUTHORIZED, null);
        }

        String loggedInUserEmail = principal.getName();
        QnA qnA = qnAService.getQnA(qnAId);
        if (qnA == null) {
            return RsData.of("404", ErrorMessages.QNA_NOT_FOUND, null);
        }

        List<QnACommentDTO> myQnAComments = commentService.getQnACommentsByUserAndQnAId(loggedInUserEmail, qnAId);
        if (myQnAComments.isEmpty()) {
            return RsData.of("404", ErrorMessages.REPLY_NO_USERS, null);
        }

        return RsData.of("200", "본인이 작성한 댓글 조회 성공", new QnACommentsResponse(myQnAComments));
    }

    // QnA 댓글 작성
    @PreAuthorize("isAuthenticated()")
    @PostMapping
    public RsData<QnACommentCreateResponse> QnACommentCreate(@PathVariable("qnAId") Long qnAId,
                                                             @Valid @RequestBody QnACommentCreateRequest commentCreateRequest,
                                                             Principal principal) {
        if (principal == null) {
            return RsData.of("401", ErrorMessages.UNAUTHORIZED, null);
        }

        String userEmail = principal.getName();
        Long parentCommentId = commentCreateRequest.getParentId();

        QnAComment comment = commentService.addComment(qnAId, userEmail, commentCreateRequest.getContent(), parentCommentId);

        if (comment == null) {
            return RsData.of("404", ErrorMessages.QNA_NOT_FOUND, null);
        }

        QnACommentCreateResponse response = new QnACommentCreateResponse(comment);

        // QnA 게시물 작성자에게 알림 전송
        QnA qnA = comment.getQnA();
        Member qnAAuthor = qnA.getAuthor();
        if (qnAAuthor != null && !qnAAuthor.getEmail().equals(userEmail)) {
            notificationService.sendNotification(
                    qnAAuthor.getId().toString(),
                    "QnA 게시물 '%s'에 댓글이 달렸습니다.".formatted(qnA.getSubject())
            );
        }

        return RsData.of("201", "댓글 작성 성공", response);
    }

    // QnA 댓글 수정
    @PreAuthorize("isAuthenticated()")
    @PatchMapping("/{commentId}")
    public RsData<QnACommentModifyResponse> QnACommentModify(@PathVariable("qnAId") Long qnAId, @PathVariable("commentId") Long commentId, @Valid @RequestBody QnACommentModifyRequest commentModifyRequest, Principal principal) {
        if (principal == null) {
            return RsData.of("401", ErrorMessages.UNAUTHORIZED, null);
        }

        String userEmail = principal.getName();
        QnAComment comment = commentService.getComment(commentId).orElse(null);

        if (comment == null) {
            return RsData.of("404", ErrorMessages.COMMENT_NOT_FOUND, null);
        }

        if (!comment.getQnA().getId().equals(qnAId)) {
            return RsData.of("404", ErrorMessages.QNA_ID_MISMATCH, null);
        }

        if (!comment.getAuthor().getEmail().equals(userEmail)) {
            return RsData.of("403", ErrorMessages.FORBIDDEN, null);
        }

        comment = commentService.updateComment(commentId, commentModifyRequest.getContent(), userEmail);

        return RsData.of("200", "댓글 수정 성공", new QnACommentModifyResponse(comment));
    }

    // QnA 댓글 삭제
    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/{commentId}")
    public RsData<String> deleteComment(@PathVariable("qnAId") Long qnAId,
                                        @PathVariable("commentId") Long commentId,
                                        Principal principal) {
        if (principal == null) {
            return RsData.of("401", ErrorMessages.UNAUTHORIZED, null);
        }

        String loggedInUser = principal.getName();
        QnAComment comment = commentService.getComment(commentId).orElse(null);

        if (comment == null) {
            return RsData.of("404", ErrorMessages.COMMENT_NOT_FOUND, null);
        }

        if (!comment.getQnA().getId().equals(qnAId)) {
            return RsData.of("404", ErrorMessages.QNA_ID_MISMATCH, null);
        }

        if (!comment.getAuthor().getEmail().equals(loggedInUser)) {
            return RsData.of("403", ErrorMessages.FORBIDDEN, null);
        }

        commentService.deleteComment(commentId);
        return RsData.of("200", "%d 번 댓글 삭제 성공".formatted(commentId), null);
    }

    // QnA 댓글 좋아요
    @PostMapping("/{commentId}/like")
    public RsData<QnACommentResponse> like(@PathVariable("qnAId") Long qnAId, @PathVariable("commentId") Long commentId,
                                           Principal principal) {
        if (principal == null) {
            return RsData.of("401", ErrorMessages.UNAUTHORIZED, null);
        }

        String loggedInUser = principal.getName();
        QnAComment comment = commentService.getComment(commentId).orElse(null);

        if (comment == null) {
            return RsData.of("404", ErrorMessages.COMMENT_NOT_FOUND, null);
        }

        if (!comment.getQnA().getId().equals(qnAId)) {
            return RsData.of("404", ErrorMessages.COMMENT_NOT_BELONG_TO_QNA, null);
        }

        Member member = memberService.getMemberByEmail(loggedInUser);
        boolean isLiked = comment.getLikedByMembers().contains(member);

        if (isLiked) {
            commentService.unlikeComment(commentId, loggedInUser);
            return RsData.of("200", "댓글 좋아요 취소", new QnACommentResponse(new QnACommentDTO(comment)));
        } else {
            commentService.likeComment(commentId, loggedInUser);
            return RsData.of("200", "댓글 좋아요 성공", new QnACommentResponse(new QnACommentDTO(comment)));
        }
    }
}
