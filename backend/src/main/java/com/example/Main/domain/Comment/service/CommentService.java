package com.example.Main.domain.Comment.service;

import com.example.Main.domain.Comment.entity.Comment;
import com.example.Main.domain.Comment.repository.CommentRepository;
import com.example.Main.domain.Member.entity.Member;
import com.example.Main.domain.Member.service.MemberService;
import com.example.Main.domain.Post.entity.Post;
import com.example.Main.domain.Post.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final MemberService memberService;

    // 댓글 등록
    public Comment addComment(Long postId, String userEmail, String content) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new IllegalArgumentException("게시물을 찾을 수 없습니다."));
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
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("댓글을 찾을 수 없습니다."));
        if (!comment.getAuthor().getEmail().equals(userEmail)) {
            throw new IllegalArgumentException("본인만 댓글을 수정할 수 있습니다.");
        }

        comment.setContent(content);
        return commentRepository.save(comment);
    }

    // 댓글 삭제
    public void deleteComment(Long commentId, String userEmail) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("댓글을 찾을 수 없습니다."));
        if (!comment.getAuthor().getEmail().equals(userEmail)) {
            throw new IllegalArgumentException("본인만 댓글을 삭제할 수 있습니다.");
        }
        commentRepository.delete(comment);  // 삭제
    }

    // 댓글 좋아요 추가
    public void likeComment(Long commentId, String userEmail) {
        Comment comment = commentRepository.findById(commentId).orElseThrow(() -> new IllegalArgumentException("댓글을 찾을 수 없습니다."));
        Member member = memberService.getMemberByEmail(userEmail);

        // 좋아요 추가 로직
        comment.addLike(member);  // 해당 메서드를 Comment 엔티티에서 구현
        commentRepository.save(comment);
    }

    // 댓글 좋아요 취소
    public void unlikeComment(Long commentId, String userEmail) {
        Comment comment = commentRepository.findById(commentId).orElseThrow(() -> new IllegalArgumentException("댓글을 찾을 수 없습니다."));
        Member member = memberService.getMemberByEmail(userEmail);

        // 좋아요 취소 로직
        comment.removeLike(member);  // 해당 메서드를 Comment 엔티티에서 구현
        commentRepository.save(comment);
    }

    // 특정 게시물에 대한 모든 댓글 조회
    public List<Comment> getCommentsByPost(Long postId) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new IllegalArgumentException("게시물을 찾을 수 없습니다."));
        return commentRepository.findByPost(post);  // Post 엔티티와 연결된 댓글들을 조회
    }

    // 특정 사용자가 작성한 댓글 조회
    public List<Comment> getCommentsByAuthor(String userEmail) {
        Member member = memberService.getMemberByEmail(userEmail);
        return commentRepository.findByAuthor(member);  // 사용자가 작성한 댓글들을 조회
    }

    // CommentService에 추가된 메서드
    public Comment getCommentById(Long commentId) {
        return commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("댓글을 찾을 수 없습니다."));
    }

}
