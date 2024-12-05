package com.example.Main.domain.Comment.service;

import com.example.Main.domain.Comment.dto.CommentDTO;
import com.example.Main.domain.Comment.entity.Comment;
import com.example.Main.domain.Comment.repository.CommentRepository;
import com.example.Main.domain.Member.entity.Member;
import com.example.Main.domain.Member.service.MemberService;
import com.example.Main.domain.Post.entity.Post;
import com.example.Main.domain.Post.repository.PostRepository;
import com.example.Main.domain.Post.service.PostService;
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
    private final PostService postService;

    // 댓글 목록 조회
    public List<CommentDTO> getCommentsByPostId(Long postId) {
        Post post = postRepository.findById(postId)
                .orElse(null);

        if (post == null) {
            return null;
        }

        List<Comment> comments = commentRepository.findByPost(post, Sort.by(Sort.Order.desc("createdDate")));
        return comments.stream()
                .filter(comment -> comment.getParentComment() == null)
                .map(CommentDTO::new)
                .collect(Collectors.toList());
    }

    // 댓글 및 대댓글 조회
    public List<CommentDTO> getRepliesByCommentId(Long commentId) {
        List<Comment> replies = commentRepository.findByParentCommentId(commentId);
        return replies.stream()
                .map(CommentDTO::new)
                .collect(Collectors.toList());
    }

    // 대댓글 조회
    public List<CommentDTO> getRepliesByParentCommentId(Long parentCommentId) {
        List<Comment> replies = commentRepository.findByParentCommentId(parentCommentId);
        return replies.stream()
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


    public Comment addComment(Long postId, String userEmail, String content, Long parentCommentId) {
        // 작성자를 이메일로 조회
        Member author = memberService.getMemberByEmail(userEmail);
        if (author == null) {
            return null;  // 작성자 정보가 없으면 null 반환
        }

        // 게시글 조회
        Post post = postService.getPost(postId);
        if (post == null) {
            return null;  // 게시글이 없으면 null 반환
        }

        // 부모 댓글이 있는 경우 (대댓글인 경우)
        Comment parentComment = null;
        if (parentCommentId != null) {
            parentComment = commentRepository.findById(parentCommentId).orElse(null);
            if (parentComment == null) {
                return null;  // 부모 댓글이 없으면 null 반환
            }
        }

        // 새 댓글 객체 생성
        Comment newComment = new Comment();
        newComment.setContent(content);
        newComment.setAuthor(author);
        newComment.setPost(post);
        newComment.setParentComment(parentComment);  // 부모 댓글이 있으면 설정, 없으면 null

        // 댓글 저장
        commentRepository.save(newComment);

        return newComment;
    }


    // 댓글 수정
    public Comment updateComment(Long commentId, String content, String userEmail) {
        Optional<Comment> commentOpt = commentRepository.findById(commentId);

        if (commentOpt.isEmpty()) {
            return null;
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
