package com.example.Main.domain.Post.Comment.service;

import com.example.Main.domain.Member.entity.Member;
import com.example.Main.domain.Member.service.MemberService;
import com.example.Main.domain.Post.Comment.dto.PostCommentDTO;
import com.example.Main.domain.Post.Comment.entity.PostComment;
import com.example.Main.domain.Post.Comment.repository.PostCommentRepository;
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
public class PostCommentService {

    private final PostCommentRepository commentRepository;
    private final PostRepository postRepository;
    private final MemberService memberService;
    private final PostService postService;

    // 댓글 목록 조회
    public List<PostCommentDTO> getCommentsByPostId(Long postId) {
        Post post = postRepository.findById(postId)
                .orElse(null);

        if (post == null) {
            return null;
        }

        List<PostComment> comments = commentRepository.findByPost(post, Sort.by(Sort.Order.desc("createdDate")));
        return comments.stream()
                .filter(comment -> comment.getParentComment() == null)
                .map(PostCommentDTO::new)
                .collect(Collectors.toList());
    }

    // 댓글 및 대댓글 조회
    public List<PostCommentDTO> getRepliesByCommentId(Long commentId) {
        List<PostComment> replies = commentRepository.findByParentCommentId(commentId, Sort.by(Sort.Order.desc("createdDate")));
        return replies.stream()
                .map(PostCommentDTO::new)
                .collect(Collectors.toList());
    }

    // 대댓글 조회
    public List<PostCommentDTO> getRepliesByParentCommentId(Long parentCommentId) {
        List<PostComment> replies = commentRepository.findByParentCommentId(parentCommentId, Sort.by(Sort.Order.desc("createdDate")));
        return replies.stream()
                .map(PostCommentDTO::new)
                .collect(Collectors.toList());
    }

    // 댓글 단일 조회
    public Optional<PostComment> getComment(Long commentId) {
        return commentRepository.findById(commentId);
    }

    // 본인이 작성한 댓글 조회
    public List<PostCommentDTO> getPostsCommentsByUserAndPostId(String email, Long postId) {
        List<PostComment> comments = commentRepository.findByPostIdAndAuthorEmail(postId, email);

        return comments.stream()
                .map(PostCommentDTO::new)
                .collect(Collectors.toList());
    }

    // 본인이 작성한 댓글 조회
    public List<PostCommentDTO> getRepliesByUserAndParentCommentId(String email, Long parentCommentId) {
        List<PostComment> replies = commentRepository.findByParentCommentIdAndAuthorEmail(parentCommentId, email);
        return replies.stream()
                .map(PostCommentDTO::new)
                .collect(Collectors.toList());
    }

    // 댓글 작성
    public PostComment addComment(Long postId, String userEmail, String content, Long parentCommentId) {

        Member author = memberService.getMemberByEmail(userEmail);
        if (author == null) {
            return null;
        }

        Post post = postService.getPost(postId);
        if (post == null) {
            return null;
        }


        PostComment parentComment = null;
        if (parentCommentId != null) {
            parentComment = commentRepository.findById(parentCommentId).orElse(null);
            if (parentComment == null) {
                return null;
            }
        }


        PostComment newComment = new PostComment();
        newComment.setContent(content);
        newComment.setAuthor(author);
        newComment.setPost(post);
        newComment.setParentComment(parentComment);

        commentRepository.save(newComment);

        return newComment;
    }


    // 댓글 수정
    public PostComment updateComment(Long commentId, String content, String userEmail) {
        Optional<PostComment> commentOpt = commentRepository.findById(commentId);

        if (commentOpt.isEmpty()) {
            return null;
        }

        PostComment comment = commentOpt.get();

        if (!comment.getAuthor().getEmail().equals(userEmail)) {
            return null;
        }

        comment.setContent(content);
        return commentRepository.save(comment);
    }

    // 댓글 삭제
    public boolean deleteComment(Long commentId) {
        Optional<PostComment> commentOpt = commentRepository.findById(commentId);

        if (commentOpt.isEmpty()) {
            return false;
        }

        PostComment comment = commentOpt.get();
        commentRepository.delete(comment);
        return true;
    }

    // 댓글 좋아요 추가
    public boolean likeComment(Long commentId, String userEmail) {
        Optional<PostComment> commentOpt = commentRepository.findById(commentId);

        if (commentOpt.isEmpty()) {
            return false;
        }

        PostComment comment = commentOpt.get();
        Member member = memberService.getMemberByEmail(userEmail);

        comment.addLike(member);
        commentRepository.save(comment);
        return true;
    }

    // 댓글 좋아요 취소
    public boolean unlikeComment(Long commentId, String userEmail) {
        Optional<PostComment> commentOpt = commentRepository.findById(commentId);

        if (commentOpt.isEmpty()) {
            return false;
        }

        PostComment comment = commentOpt.get();
        Member member = memberService.getMemberByEmail(userEmail);

        comment.removeLike(member);
        commentRepository.save(comment);
        return true;
    }
}
