package com.example.Main.domain.QnA.Comment.controller;

import com.example.Main.domain.Member.entity.Member;
import com.example.Main.domain.Member.service.MemberService;
import com.example.Main.domain.QnA.Comment.dto.QnACommentDTO;
import com.example.Main.domain.QnA.Comment.dto.request.QnACommentCreateRequest;
import com.example.Main.domain.QnA.Comment.dto.request.QnACommentModifyRequest;
import com.example.Main.domain.QnA.Comment.dto.response.CommentCreateResponse;
import com.example.Main.domain.QnA.Comment.dto.response.CommentModifyResponse;
import com.example.Main.domain.QnA.Comment.dto.response.CommentResponse;
import com.example.Main.domain.QnA.Comment.dto.response.CommentsResponse;
import com.example.Main.domain.QnA.Comment.entity.QnAComment;
import com.example.Main.domain.QnA.Comment.service.QnACommentService;
import com.example.Main.domain.QnA.entity.QnA;
import com.example.Main.domain.QnA.service.QnAService;
import com.example.Main.global.RsData.RsData;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/api/v1/qna/{qnAId}/comments")
public class ApiV1CommentQnAController {

    private final QnACommentService commentService;
    private final MemberService memberService;
    private final QnAService qnAService;

    // 특정 QnA의 댓글 목록 조회 (다건 조회)
    @GetMapping
    public RsData<CommentsResponse> getComments(@PathVariable("qnAId") Long qnAId) {
        QnA qnA = qnAService.getQnA(qnAId);
        if (qnA == null) {
            return RsData.of("404", "QnA를 찾을 수 없습니다.", null);
        }

        List<QnACommentDTO> comments = commentService.getCommentsByQnAId(qnAId);
        if (comments.isEmpty()) {
            return RsData.of("404", "댓글이 없습니다.", null);
        }

        return RsData.of("200", "댓글 조회 성공 (QnA 제목: " + qnA.getSubject() + ")", new CommentsResponse(comments));
    }

    // 특정 QnA의 댓글 조회 (단건 조회)
    @GetMapping("/{commentId}")
    public RsData<QnACommentDTO> getComment(@PathVariable("qnAId") Long qnAId, @PathVariable("commentId") Long commentId) {
        QnA qnA = qnAService.getQnA(qnAId);
        if (qnA == null) {
            return RsData.of("404", "QnA를 찾을 수 없습니다.", null);
        }

        QnAComment comment = commentService.getComment(commentId).orElse(null);
        if (comment == null || !comment.getQnA().getId().equals(qnAId)) {
            return RsData.of("404", "댓글이 존재하지 않거나, QnA와 일치하지 않습니다.", null);
        }

        return RsData.of("200", "댓글 조회 성공 (QnA 제목: " + qnA.getSubject() + ")", new QnACommentDTO(comment));
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/mycomments")
    public RsData<CommentsResponse> getMyQnAComments(@PathVariable("qnAId") Long qnAId, Principal principal) {
        if (principal == null) {
            return RsData.of("401", "로그인 후 사용 가능합니다.", null);
        }

        String loggedInUserEmail = principal.getName();
        QnA qnA = qnAService.getQnA(qnAId);
        if (qnA == null) {
            return RsData.of("404", "QnA가 존재하지 않습니다.", null);
        }

        List<QnACommentDTO> myQnAComments = commentService.getQnACommentsByUserAndQnAId(loggedInUserEmail, qnAId);
        if (myQnAComments.isEmpty()) {
            return RsData.of("404", "본인이 작성한 댓글이 없습니다.", null);
        }

        return RsData.of("200", "본인이 작성한 댓글 조회 성공", new CommentsResponse(myQnAComments));
    }

    // QnA 댓글 작성
    @PreAuthorize("isAuthenticated()")
    @PostMapping
    public RsData<CommentCreateResponse> postCommentCreate(@PathVariable("qnAId") Long qnAId,
                                                           @Valid @RequestBody QnACommentCreateRequest commentCreateRequest,
                                                           Principal principal) {
        if (principal == null) {
            return RsData.of("401", "로그인 후 사용 가능합니다.", null);
        }

        String userEmail = principal.getName();
        Long parentCommentId = commentCreateRequest.getParentCommentId();

        QnAComment comment = commentService.addComment(qnAId, userEmail, commentCreateRequest.getContent(), parentCommentId);

        if (comment == null) {
            return RsData.of("404", "QnA가 존재하지 않습니다.", null);
        }

        // CommentCreateResponse 사용
        CommentCreateResponse response = new CommentCreateResponse(comment);
        return RsData.of("201", "댓글 작성 성공", response);
    }

    // QnA 댓글 수정
    @PreAuthorize("isAuthenticated()")
    @PatchMapping("/{commentId}")
    public RsData<CommentModifyResponse> postCommentModify(@PathVariable("qnAId") Long qnAId, @PathVariable("commentId") Long commentId, @Valid @RequestBody QnACommentModifyRequest commentModifyRequest, Principal principal) {
        if (principal == null) {
            return RsData.of("401", "로그인 후 사용 가능합니다.", null);
        }

        String userEmail = principal.getName();
        QnAComment comment = commentService.getComment(commentId).orElse(null);

        if (comment == null) {
            return RsData.of("404", "댓글을 찾을 수 없습니다.", null);
        }

        if (!comment.getQnA().getId().equals(qnAId)) {
            return RsData.of("404", "댓글이 속한 QnA 번호가 일치하지 않습니다.", null);
        }

        if (!comment.getAuthor().getEmail().equals(userEmail)) {
            return RsData.of("403", "본인만 댓글을 수정할 수 있습니다.", null);
        }

        comment = commentService.updateComment(commentId, commentModifyRequest.getContent(), userEmail);

        return RsData.of("200", "댓글 수정 성공", new CommentModifyResponse(comment));
    }

    // QnA 댓글 삭제
    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/{commentId}")
    public RsData<String> deleteComment(@PathVariable("qnAId") Long qnAId,
                                        @PathVariable("commentId") Long commentId,
                                        Principal principal) {

        if (principal == null) {
            return RsData.of("401", "로그인 후 사용 가능합니다.", null);
        }

        String loggedInUser = principal.getName();
        QnAComment comment = commentService.getComment(commentId).orElse(null);

        if (comment == null) {
            return RsData.of("404", "댓글이 존재하지 않습니다.", null);
        }

        if (!comment.getQnA().getId().equals(qnAId)) {
            return RsData.of("404", "댓글이 속한 QnA 번호가 일치하지 않습니다.", null);
        }

        if (commentService.hasReplies(comment)) {
            return RsData.of("400", "대댓글이 달린 댓글은 삭제할 수 없습니다.", null);
        }

        if (!comment.getAuthor().getEmail().equals(loggedInUser)) {
            return RsData.of("403", "본인만 댓글을 삭제할 수 있습니다.", null);
        }

        commentService.deleteComment(commentId);
        return RsData.of("200", "%d 번 댓글 삭제 성공".formatted(commentId), null);
    }

    // QnA 댓글 좋아요
    @PostMapping("/{commentId}/like")
    public RsData<CommentResponse> like(@PathVariable("qnAId") Long qnAId, @PathVariable("commentId") Long commentId,
                                        Principal principal) {
        if (principal == null) {
            return RsData.of("401", "로그인 후 사용 가능합니다.", null);
        }

        String loggedInUser = principal.getName();
        QnAComment comment = commentService.getComment(commentId).orElse(null);

        if (comment == null) {
            return RsData.of("404", "댓글이 존재하지 않거나 임시 저장된 댓글입니다.", null);
        }

        if (!comment.getQnA().getId().equals(qnAId)) {
            return RsData.of("404", "댓글이 해당 QnA와 일치하지 않습니다.", null);
        }

        Member member = memberService.getMemberByEmail(loggedInUser);
        boolean isLiked = comment.getLikedByMembers().contains(member);

        if (isLiked) {
            commentService.unlikeComment(commentId, loggedInUser);
            return RsData.of("200", "댓글 좋아요 취소", new CommentResponse(new QnACommentDTO(comment)));
        } else {
            commentService.likeComment(commentId, loggedInUser);
            return RsData.of("200", "댓글 좋아요 성공", new CommentResponse(new QnACommentDTO(comment)));
        }
    }

    // 대댓글 조회
    @GetMapping("/{commentId}/replies")
    public RsData<List<QnACommentDTO>> getReplies(@PathVariable("qnAId") Long qnAId, @PathVariable("commentId") Long commentId) {

        QnA qna = qnAService.getQnA(qnAId);
        if (qna == null) {
            return RsData.of("404", "QnA를 찾을 수 없습니다.", null);
        }

        List<QnACommentDTO> replies = commentService.getRepliesByParentCommentId(commentId);

        if (replies.isEmpty()) {
            return RsData.of("404", "대댓글이 없습니다.", null);
        }

        return RsData.of("200", "대댓글 조회 성공", replies);
    }

    // 대댓글 단건 조회
    @GetMapping("/{commentId}/replies/{replyId}")
    public RsData<QnACommentDTO> getReply(@PathVariable("qnAId") Long qnAId, @PathVariable("commentId") Long commentId,
                                          @PathVariable("replyId") Long replyId) {

        QnA qna = qnAService.getQnA(qnAId);
        if (qna == null) {
            return RsData.of("404", "QnA를 찾을 수 없습니다.", null);
        }

        QnAComment parentComment = commentService.getComment(commentId).orElse(null);
        if (parentComment == null) {
            return RsData.of("404", "부모 댓글을 찾을 수 없습니다.", null);
        }

        QnAComment reply = commentService.getComment(replyId).orElse(null);
        if (reply == null || !reply.getParentComment().getId().equals(commentId)) {
            return RsData.of("404", "대댓글이 존재하지 않거나 부모 댓글과 일치하지 않습니다.", null);
        }

        if (!qna.getId().equals(reply.getQnA().getId())) {
            return RsData.of("404", "대댓글이 속한 QnA 번호가 일치하지 않습니다.", null);
        }

        return RsData.of("200", "대댓글 조회 성공", new QnACommentDTO(reply));
    }

    // 본인이 작성한 대댓글 조회
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/{commentId}/myreplies")
    public RsData<List<QnACommentDTO>> getMyReplies(@PathVariable("qnAId") Long qnAId, @PathVariable("commentId") Long commentId, Principal principal) {
        if (principal == null) {
            return RsData.of("401", "로그인 후 사용 가능합니다.", null);
        }

        String loggedInUserEmail = principal.getName();

        QnA qna = qnAService.getQnA(qnAId);
        if (qna == null) {
            return RsData.of("404", "QnA를 찾을 수 없습니다.", null);
        }

        QnAComment parentComment = commentService.getComment(commentId).orElse(null);
        if (parentComment == null) {
            return RsData.of("404", "부모 댓글을 찾을 수 없습니다.", null);
        }

        List<QnACommentDTO> myReplies = commentService.getRepliesByUserAndParentCommentId(loggedInUserEmail, commentId);
        myReplies.removeIf(reply -> !reply.getQnAId().equals(qnAId));

        if (myReplies.isEmpty()) {
            return RsData.of("404", "본인이 작성한 대댓글이 없습니다.", null);
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
            return RsData.of("401", "로그인 후 사용 가능합니다.", null);
        }

        String userEmail = principal.getName();
        Long parentCommentId = commentId;
        String content = commentCreateRequest.getContent();

        QnA qna = qnAService.getQnA(qnAId);
        if (qna == null) {
            return RsData.of("404", "QnA를 찾을 수 없습니다.", null);
        }

        QnAComment parentComment = commentService.getComment(parentCommentId).orElse(null);
        if (parentComment == null) {
            return RsData.of("404", "부모 댓글을 찾을 수 없습니다.", null);
        }

        if (!parentComment.getQnA().getId().equals(qnAId)) {
            return RsData.of("404", "부모 댓글과 QnA 번호가 일치하지 않습니다.", null);
        }

        QnAComment replyComment = commentService.addComment(qnAId, userEmail, content, parentCommentId);

        if (replyComment == null || !replyComment.getQnA().getId().equals(qnAId)) {
            return RsData.of("404", "대댓글 작성에 실패했습니다.", null);
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
            return RsData.of("401", "로그인 후 사용 가능합니다.", null);
        }

        String loggedInUserEmail = principal.getName();

        QnA qna = qnAService.getQnA(qnAId);
        if (qna == null) {
            return RsData.of("404", "QnA를 찾을 수 없습니다.", null);
        }

        QnAComment parentComment = commentService.getComment(commentId).orElse(null);
        if (parentComment == null) {
            return RsData.of("404", "부모 댓글을 찾을 수 없습니다.", null);
        }

        QnAComment reply = commentService.getComment(replyId).orElse(null);
        if (reply == null || !reply.getParentComment().getId().equals(commentId)) {
            return RsData.of("404", "대댓글이 존재하지 않거나 부모 댓글과 일치하지 않습니다.", null);
        }

        if (!qna.getId().equals(reply.getQnA().getId())) {
            return RsData.of("404", "대댓글이 속한 QnA 번호가 일치하지 않습니다.", null);
        }

        if (!reply.getAuthor().getEmail().equals(loggedInUserEmail)) {
            return RsData.of("403", "본인만 대댓글을 수정할 수 있습니다.", null);
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
            return RsData.of("401", "로그인 후 사용 가능합니다.", null);
        }

        String loggedInUser = principal.getName();

        QnA qna = qnAService.getQnA(qnAId);
        if (qna == null) {
            return RsData.of("404", "QnA를 찾을 수 없습니다.", null);
        }

        QnAComment parentComment = commentService.getComment(commentId).orElse(null);
        if (parentComment == null) {
            return RsData.of("404", "부모 댓글을 찾을 수 없습니다.", null);
        }

        QnAComment reply = commentService.getComment(replyId).orElse(null);
        if (reply == null || !reply.getParentComment().getId().equals(commentId)) {
            return RsData.of("404", "대댓글이 존재하지 않거나 부모 댓글과 일치하지 않습니다.", null);
        }

        if (!qna.getId().equals(reply.getQnA().getId())) {
            return RsData.of("404", "대댓글이 속한 QnA 번호가 일치하지 않습니다.", null);
        }

        if (!reply.getAuthor().getEmail().equals(loggedInUser)) {
            return RsData.of("403", "본인만 대댓글을 삭제할 수 있습니다.", null);
        }

        if (commentService.hasReplies(reply)) {
            return RsData.of("400", "대댓글에 대댓글이 달려 있는 경우 삭제할 수 없습니다.", null);
        }

        commentService.deleteComment(replyId);
        return RsData.of("200", "%d 번 대댓글 삭제 성공".formatted(replyId), null);
    }
}
