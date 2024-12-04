package com.example.Main.domain.Comment.controller;

import com.example.Main.domain.Comment.dto.CommentDTO;
import com.example.Main.domain.Comment.dto.request.CommentCreateRequest;
import com.example.Main.domain.Comment.dto.request.CommentLikeDTO;
import com.example.Main.domain.Comment.dto.request.CommentModifyRequest;
import com.example.Main.domain.Comment.dto.response.CommentResponse;
import com.example.Main.domain.Comment.entity.Comment;
import com.example.Main.domain.Comment.service.CommentService;
import com.example.Main.domain.Member.entity.Member;
import com.example.Main.domain.Member.service.MemberService;
import com.example.Main.domain.Post.dto.PostDTO;
import com.example.Main.domain.Post.dto.response.PostResponse;
import com.example.Main.global.RsData.RsData;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/api/v1/post")
public class ApiV1CommentPostController {

    private final CommentService commentService;
    private final MemberService memberService;

    // 댓글 작성
    @PostMapping("/{postId}/comments")
    public RsData<CommentDTO> PostCommentCreate(@PathVariable("postId") Long postId,
                                                @Valid @RequestBody CommentCreateRequest commentCreateRequest,
                                                Principal principal) {
        if (principal == null) {
            return RsData.of("401", "로그인 후 사용 가능합니다.", null);
        }

        String userEmail = principal.getName();
        Comment comment = commentService.addComment(postId, userEmail, commentCreateRequest.getContent());

        return RsData.of("200", "댓글 작성 성공", new CommentDTO(comment));
    }

    // 댓글 수정
    @PatchMapping("/comments/{commentId}")
    public RsData<CommentDTO> PostCommentModify(@PathVariable("commentId") Long commentId,
                                                @Valid @RequestBody CommentModifyRequest commentModifyRequest,
                                                Principal principal) {
        if (principal == null) {
            return RsData.of("401", "로그인 후 사용 가능합니다.", null);
        }

        String userEmail = principal.getName();
        Comment comment = commentService.updateComment(commentId, commentModifyRequest.getContent(), userEmail);

        return RsData.of("200", "댓글 수정 성공", new CommentDTO(comment));
    }

    // 댓글 삭제
    @DeleteMapping("/comments/{commentId}")
    public RsData<String> PostCommentDelete(@PathVariable("commentId") Long commentId, Principal principal) {
        if (principal == null) {
            return RsData.of("401", "로그인 후 사용 가능합니다.", null);
        }

        String userEmail = principal.getName();
        commentService.deleteComment(commentId, userEmail);

        return RsData.of("200", "댓글 삭제 성공", null);
    }

    // 좋아요
    @PostMapping("/comments/{commentId}/like")
    public RsData<CommentResponse> like (@PathVariable("commentId") Long commentId, @RequestBody CommentLikeDTO commentLikeDTO, Principal principal){

        if(principal==null){
            return RsData.of("401","로그인 후 사용 가능합니다.",null);
        }
        String loggedInUser = principal.getName();
        Comment comment = this.commentService.getCommentById(commentId);

        if(comment==null){
            return RsData.of("500", "%d 번 게시물은 존재하지 않거나 임시 저장된 게시물입니다.".formatted(commentId), null);
        }
        String loggedInUserEmail = loggedInUser;
        Member member = memberService.getMemberByEmail(loggedInUserEmail);
        boolean isLiked = comment.getLikedByMembers().contains(member);

        if(isLiked){
            this.commentService.unlikeComment(commentId,loggedInUserEmail);
            return RsData.of("200", "%d 번 게시물의 좋아요가 취소되었습니다.".formatted(commentId), new CommentResponse(new CommentDTO(comment)));
        }else {
            // 좋아요
            this.commentService.likeComment(commentId, loggedInUserEmail);
            return RsData.of("200", "%d 번 게시물에 좋아요 성공".formatted(commentId), new CommentResponse(new CommentDTO(comment)));
        }
    }

}
