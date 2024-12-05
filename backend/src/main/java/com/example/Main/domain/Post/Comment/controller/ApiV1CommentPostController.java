package com.example.Main.domain.Post.Comment.controller;

import com.example.Main.domain.Member.entity.Member;
import com.example.Main.domain.Member.service.MemberService;
import com.example.Main.domain.Post.Comment.dto.CommentDTO;
import com.example.Main.domain.Post.Comment.dto.request.CommentCreateRequest;
import com.example.Main.domain.Post.Comment.dto.request.CommentModifyRequest;
import com.example.Main.domain.Post.Comment.dto.response.CommentCreateResponse;
import com.example.Main.domain.Post.Comment.dto.response.CommentModifyResponse;
import com.example.Main.domain.Post.Comment.dto.response.CommentResponse;
import com.example.Main.domain.Post.Comment.dto.response.CommentsResponse;
import com.example.Main.domain.Post.Comment.entity.Comment;
import com.example.Main.domain.Post.Comment.service.CommentService;
import com.example.Main.domain.Post.entity.Post;
import com.example.Main.domain.Post.service.PostService;
import com.example.Main.global.RsData.RsData;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/api/v1/post/{postId}/comments")
public class ApiV1CommentPostController {

    private final CommentService commentService;
    private final MemberService memberService;
    private final PostService postService;

    // 특정 게시글의 댓글 목록 조회 (다건 조회)
    @GetMapping
    public RsData<CommentsResponse> getComments(@PathVariable("postId") Long postId) {
        Post post = postService.getPost(postId);
        if (post == null) {
            return RsData.of("404", "게시글을 찾을 수 없습니다.", null);
        }

        List<CommentDTO> comments = commentService.getCommentsByPostId(postId);
        if (comments.isEmpty()) {
            return RsData.of("404", "댓글이 없습니다.", null);
        }

        return RsData.of("200", "댓글 조회 성공 (게시글 제목: " + post.getSubject() + ")", new CommentsResponse(comments));
    }

    // 특정 게시글의 댓글 조회 (단건 조회)
    @GetMapping("/{commentId}")
    public RsData<CommentDTO> getComment(@PathVariable("postId") Long postId, @PathVariable("commentId") Long commentId) {
        Post post = postService.getPost(postId);
        if (post == null) {
            return RsData.of("404", "게시글을 찾을 수 없습니다.", null);
        }

        Comment comment = commentService.getComment(commentId).orElse(null);
        if (comment == null || !comment.getPost().getId().equals(postId)) {
            return RsData.of("404", "댓글이 존재하지 않거나, 게시글과 일치하지 않습니다.", null);
        }

        return RsData.of("200", "댓글 조회 성공 (게시글 제목: " + post.getSubject() + ")", new CommentDTO(comment));
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/mycomments")
    public RsData<CommentsResponse> getMyPostComments(@PathVariable("postId") Long postId, Principal principal) {
        if (principal == null) {
            return RsData.of("401", "로그인 후 사용 가능합니다.", null);
        }

        String loggedInUserEmail = principal.getName();
        Post post = postService.getPost(postId);
        if (post == null) {
            return RsData.of("404", "게시글이 존재하지 않습니다.", null);
        }

        List<CommentDTO> myPostComments = commentService.getPostsCommentsByUserAndPostId(loggedInUserEmail, postId);
        if (myPostComments.isEmpty()) {
            return RsData.of("404", "본인이 작성한 댓글이 없습니다.", null);
        }

        return RsData.of("200", "본인이 작성한 댓글 조회 성공", new CommentsResponse(myPostComments));
    }

    // 게시글 댓글 작성
    @PreAuthorize("isAuthenticated()")
    @PostMapping
    public RsData<CommentCreateResponse> postCommentCreate(@PathVariable("postId") Long postId,
                                                           @Valid @RequestBody CommentCreateRequest commentCreateRequest,
                                                           Principal principal) {
        if (principal == null) {
            return RsData.of("401", "로그인 후 사용 가능합니다.", null);
        }

        String userEmail = principal.getName();
        Long parentCommentId = commentCreateRequest.getParentCommentId();

        Comment comment = commentService.addComment(postId, userEmail, commentCreateRequest.getContent(), parentCommentId);

        if (comment == null) {
            return RsData.of("404", "게시글이 존재하지 않습니다.", null);
        }

        // CommentCreateResponse 사용
        CommentCreateResponse response = new CommentCreateResponse(comment);
        return RsData.of("201", "댓글 작성 성공", response);
    }


    // 게시글 댓글 수정
    @PreAuthorize("isAuthenticated()")
    @PatchMapping("/{commentId}")
    public RsData<CommentModifyResponse> postCommentModify(@PathVariable("postId") Long postId, @PathVariable("commentId") Long commentId, @Valid @RequestBody CommentModifyRequest commentModifyRequest, Principal principal) {
        if (principal == null) {
            return RsData.of("401", "로그인 후 사용 가능합니다.", null);
        }

        String userEmail = principal.getName();
        Comment comment = commentService.getComment(commentId).orElse(null);

        if (comment == null) {
            return RsData.of("404", "댓글을 찾을 수 없습니다.", null);
        }

        if (!comment.getPost().getId().equals(postId)) {
            return RsData.of("404", "댓글이 속한 게시글 번호가 일치하지 않습니다.", null);
        }


        if (!comment.getAuthor().getEmail().equals(userEmail)) {
            return RsData.of("403", "본인만 댓글을 수정할 수 있습니다.", null);
        }


        comment = commentService.updateComment(commentId, commentModifyRequest.getContent(), userEmail);

        return RsData.of("200", "댓글 수정 성공", new CommentModifyResponse(comment));
    }

    // 게시글 댓글 삭제
    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/{commentId}")
    public RsData<String> deleteComment(@PathVariable("postId") Long postId, @PathVariable("commentId") Long commentId, Principal principal) {
        if (principal == null) {
            return RsData.of("401", "로그인 후 사용 가능합니다.", null);
        }

        String loggedInUser = principal.getName();
        Comment comment = commentService.getComment(commentId).orElse(null);

        if (comment == null) {
            return RsData.of("404", "댓글이 존재하지 않습니다.", null);
        }


        if (!comment.getPost().getId().equals(postId)) {
            return RsData.of("404", "댓글이 속한 게시글 번호가 일치하지 않습니다.", null);
        }


        if (!comment.getAuthor().getEmail().equals(loggedInUser)) {
            return RsData.of("403", "본인만 댓글을 삭제할 수 있습니다.", null);
        }

        commentService.deleteComment(commentId);
        return RsData.of("200", "%d 번 댓글 삭제 성공".formatted(commentId), null);
    }

    // 게시글 댓글 좋아요
    @PostMapping("/{commentId}/like")
    public RsData<CommentResponse> like(@PathVariable("postId") Long postId, @PathVariable("commentId") Long commentId,
                                        Principal principal) {
        if (principal == null) {
            return RsData.of("401", "로그인 후 사용 가능합니다.", null);
        }

        String loggedInUser = principal.getName();
        Comment comment = commentService.getComment(commentId).orElse(null);

        if (comment == null) {
            return RsData.of("404", "댓글이 존재하지 않거나 임시 저장된 댓글입니다.", null);
        }

        if (!comment.getPost().getId().equals(postId)) {
            return RsData.of("404", "댓글이 해당 게시글과 일치하지 않습니다.", null);
        }

        Member member = memberService.getMemberByEmail(loggedInUser);
        boolean isLiked = comment.getLikedByMembers().contains(member);

        if (isLiked) {
            commentService.unlikeComment(commentId, loggedInUser);
            return RsData.of("200", "댓글 좋아요 취소", new CommentResponse(new CommentDTO(comment)));
        } else {
            commentService.likeComment(commentId, loggedInUser);
            return RsData.of("200", "댓글 좋아요 성공", new CommentResponse(new CommentDTO(comment)));
        }
    }

    // 대댓글 조회
    @GetMapping("/{commentId}/replies")
    public RsData<List<CommentDTO>> getReplies(@PathVariable("postId") Long postId, @PathVariable("commentId") Long commentId) {

        Post post = postService.getPost(postId);
        if (post == null) {
            return RsData.of("404", "게시글을 찾을 수 없습니다.", null);
        }


        List<CommentDTO> replies = commentService.getRepliesByParentCommentId(commentId);

        if (replies.isEmpty()) {
            return RsData.of("404", "대댓글이 없습니다.", null);
        }

        return RsData.of("200", "대댓글 조회 성공", replies);
    }

    // 대댓글 단건 조회
    @GetMapping("/{commentId}/replies/{replyId}")
    public RsData<CommentDTO> getReply(@PathVariable("postId") Long postId, @PathVariable("commentId") Long commentId,
                                       @PathVariable("replyId") Long replyId) {


        Post post = postService.getPost(postId);
        if (post == null) {
            return RsData.of("404", "게시글을 찾을 수 없습니다.", null);
        }


        Comment parentComment = commentService.getComment(commentId).orElse(null);
        if (parentComment == null) {
            return RsData.of("404", "부모 댓글을 찾을 수 없습니다.", null);
        }


        Comment reply = commentService.getComment(replyId).orElse(null);
        if (reply == null || !reply.getParentComment().getId().equals(commentId)) {
            return RsData.of("404", "대댓글이 존재하지 않거나 부모 댓글과 일치하지 않습니다.", null);
        }


        if (!post.getId().equals(reply.getPost().getId())) {
            return RsData.of("404", "대댓글이 속한 게시글 번호가 일치하지 않습니다.", null);
        }

        return RsData.of("200", "대댓글 조회 성공", new CommentDTO(reply));
    }

    // 본인이 작성한 대댓글 조회
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/{commentId}/myreplies")
    public RsData<List<CommentDTO>> getMyReplies(@PathVariable("postId") Long postId, @PathVariable("commentId") Long commentId, Principal principal) {
        if (principal == null) {
            return RsData.of("401", "로그인 후 사용 가능합니다.", null);
        }

        String loggedInUserEmail = principal.getName();


        Post post = postService.getPost(postId);
        if (post == null) {
            return RsData.of("404", "게시글을 찾을 수 없습니다.", null);
        }


        Comment parentComment = commentService.getComment(commentId).orElse(null);
        if (parentComment == null) {
            return RsData.of("404", "부모 댓글을 찾을 수 없습니다.", null);
        }


        List<CommentDTO> myReplies = commentService.getRepliesByUserAndParentCommentId(loggedInUserEmail, commentId);


        myReplies.removeIf(reply -> !reply.getPostId().equals(postId));

        if (myReplies.isEmpty()) {
            return RsData.of("404", "본인이 작성한 대댓글이 없습니다.", null);
        }

        return RsData.of("200", "본인이 작성한 대댓글 조회 성공", myReplies);
    }

    // 대댓글 작성
    @PreAuthorize("isAuthenticated()")
    @PostMapping("/{commentId}/replies")
    public RsData<CommentDTO> postReplyCreate(@PathVariable("postId") Long postId, @PathVariable("commentId") Long commentId,
                                              @Valid @RequestBody CommentCreateRequest commentCreateRequest,
                                              Principal principal) {
        if (principal == null) {
            return RsData.of("401", "로그인 후 사용 가능합니다.", null);
        }

        String userEmail = principal.getName();
        Long parentCommentId = commentId;
        String content = commentCreateRequest.getContent();


        Post post = postService.getPost(postId);
        if (post == null) {
            return RsData.of("404", "게시글을 찾을 수 없습니다.", null);
        }


        Comment parentComment = commentService.getComment(parentCommentId).orElse(null);
        if (parentComment == null) {
            return RsData.of("404", "부모 댓글을 찾을 수 없습니다.", null);
        }


        if (!parentComment.getPost().getId().equals(postId)) {
            return RsData.of("404", "부모 댓글과 게시글 번호가 일치하지 않습니다.", null);
        }


        Comment replyComment = commentService.addComment(postId, userEmail, content, parentCommentId);

        if (replyComment == null || !replyComment.getPost().getId().equals(postId)) {
            return RsData.of("404", "대댓글 작성에 실패했습니다.", null);
        }

        return RsData.of("201", "대댓글 작성 성공", new CommentDTO(replyComment));
    }

    // 대댓글 수정
    @PreAuthorize("isAuthenticated()")
    @PatchMapping("/{commentId}/replies/{replyId}")
    public RsData<CommentDTO> modifyReply(@PathVariable("postId") Long postId, @PathVariable("commentId") Long commentId,
                                          @PathVariable("replyId") Long replyId,
                                          @Valid @RequestBody CommentModifyRequest commentModifyRequest,
                                          Principal principal) {
        if (principal == null) {
            return RsData.of("401", "로그인 후 사용 가능합니다.", null);
        }

        String loggedInUserEmail = principal.getName();


        Post post = postService.getPost(postId);
        if (post == null) {
            return RsData.of("404", "게시글을 찾을 수 없습니다.", null);
        }


        Comment parentComment = commentService.getComment(commentId).orElse(null);
        if (parentComment == null) {
            return RsData.of("404", "부모 댓글을 찾을 수 없습니다.", null);
        }


        Comment reply = commentService.getComment(replyId).orElse(null);
        if (reply == null || !reply.getParentComment().getId().equals(commentId)) {
            return RsData.of("404", "대댓글이 존재하지 않거나 부모 댓글과 일치하지 않습니다.", null);
        }


        if (!post.getId().equals(reply.getPost().getId())) {
            return RsData.of("404", "대댓글이 속한 게시글 번호가 일치하지 않습니다.", null);
        }

        if (!reply.getAuthor().getEmail().equals(loggedInUserEmail)) {
            return RsData.of("403", "본인만 대댓글을 수정할 수 있습니다.", null);
        }

        reply = commentService.updateComment(replyId, commentModifyRequest.getContent(), loggedInUserEmail);
        return RsData.of("200", "대댓글 수정 성공", new CommentDTO(reply));
    }

    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/{commentId}/replies/{replyId}")
    public RsData<String> deleteReply(@PathVariable("postId") Long postId, @PathVariable("commentId") Long commentId,
                                      @PathVariable("replyId") Long replyId, Principal principal) {
        if (principal == null) {
            return RsData.of("401", "로그인 후 사용 가능합니다.", null);
        }

        String loggedInUser = principal.getName();


        Post post = postService.getPost(postId);
        if (post == null) {
            return RsData.of("404", "게시글을 찾을 수 없습니다.", null);
        }


        Comment parentComment = commentService.getComment(commentId).orElse(null);
        if (parentComment == null) {
            return RsData.of("404", "부모 댓글을 찾을 수 없습니다.", null);
        }


        Comment reply = commentService.getComment(replyId).orElse(null);
        if (reply == null || !reply.getParentComment().getId().equals(commentId)) {
            return RsData.of("404", "대댓글이 존재하지 않거나 부모 댓글과 일치하지 않습니다.", null);
        }


        if (!post.getId().equals(reply.getPost().getId())) {
            return RsData.of("404", "대댓글이 속한 게시글 번호가 일치하지 않습니다.", null);
        }

        if (!reply.getAuthor().getEmail().equals(loggedInUser)) {
            return RsData.of("403", "본인만 대댓글을 삭제할 수 있습니다.", null);
        }

        commentService.deleteComment(replyId);
        return RsData.of("200", "%d 번 대댓글 삭제 성공".formatted(replyId), null);
    }
}
