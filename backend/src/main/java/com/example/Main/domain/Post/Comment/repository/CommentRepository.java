package com.example.Main.domain.Post.Comment.repository;

import com.example.Main.domain.Post.Comment.entity.Comment;
import com.example.Main.domain.Post.entity.Post;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByPost(Post post, Sort sort);

    // 게시글에 본인이 작성한 댓글 조회
    List<Comment> findByPostIdAndAuthorEmail(Long postId, String email);

    // 대댓글 조회
    List<Comment> findByParentCommentId(Long commentId,Sort sort);

    // 댓글에 본인이 작성한 대댓글 조회
    List<Comment> findByParentCommentIdAndAuthorEmail(Long parentCommentId, String authorEmail);

}
