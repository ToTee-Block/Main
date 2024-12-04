package com.example.Main.domain.Comment.service;

import com.example.Main.domain.Comment.dto.CommentDTO;
import com.example.Main.domain.Comment.entity.Comment;
import com.example.Main.domain.Comment.repository.CommentRepository;
import com.example.Main.domain.Member.entity.Member;
import com.example.Main.domain.Member.service.MemberService;
import com.example.Main.domain.Post.entity.Post;
import com.example.Main.domain.Post.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final MemberService memberService;

    // 댓글 목록 조회
    public List<CommentDTO> getCommentsByPostId(Long postId) {
        Post post = postRepository.findById(postId)
                .orElse(null);

        if (post == null) {
            return null;
        }

        List<Comment> comments = commentRepository.findByPost(post, Sort.by(Sort.Order.desc("createdDate")));
        return comments.stream()
                .map(CommentDTO::new)
                .collect(Collectors.toList());
    }

    // 댓글 단일 조회
    public Optional<Comment> getComment(Long commentId) {
        return commentRepository.findById(commentId);
    }

    // 본인이 작성한 댓글 조회
    public List<CommentDTO> getPostsCommentsByUserAndPostId(String email, Long postId) {
        List<Comment> comments = commentRepository.findByPostIdAndAuthorEmail(postId, email);

        return comments.stream()
                .map(CommentDTO::new)
                .collect(Collectors.toList());
    }


    // 댓글 작성
    public Comment addComment(Long postId, String userEmail, String content) {
        Post post = postRepository.findById(postId)
                .orElse(null);
        if (post == null) {
            return null;
        }

        Member member = memberService.getMemberByEmail(userEmail);

        Comment comment = Comment.builder()
                .content(content)
                .post(post)
                .author(member)
                .build();

        return commentRepository.save(comment);
    }

    // 댓글 수정
    public Comment updateComment(Long commentId, String content, String userEmail) {
        Optional<Comment> commentOpt = commentRepository.findById(commentId);

        if (commentOpt.isEmpty()) {
            return null;  //
        }

        Comment comment = commentOpt.get();
        comment.setContent(content);
        return commentRepository.save(comment);
    }

    // 댓글 삭제
    public boolean deleteComment(Long commentId) {
        Optional<Comment> commentOpt = commentRepository.findById(commentId);

        if (commentOpt.isEmpty()) {
            return false;
        }

        Comment comment = commentOpt.get();
        commentRepository.delete(comment);
        return true;
    }

    // 댓글 좋아요 추가
    public boolean likeComment(Long commentId, String userEmail) {
        Optional<Comment> commentOpt = commentRepository.findById(commentId);

        if (commentOpt.isEmpty()) {
            return false;
        }

        Comment comment = commentOpt.get();
        Member member = memberService.getMemberByEmail(userEmail);

        comment.addLike(member);
        commentRepository.save(comment);
        return true;
    }

    // 댓글 좋아요 취소
    public boolean unlikeComment(Long commentId, String userEmail) {
        Optional<Comment> commentOpt = commentRepository.findById(commentId);

        if (commentOpt.isEmpty()) {
            return false;
        }

        Comment comment = commentOpt.get();
        Member member = memberService.getMemberByEmail(userEmail);

        comment.removeLike(member);
        commentRepository.save(comment);
        return true;
    }



}
