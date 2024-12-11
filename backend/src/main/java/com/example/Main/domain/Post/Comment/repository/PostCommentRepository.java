package com.example.Main.domain.Post.Comment.repository;

import com.example.Main.domain.Post.Comment.entity.PostComment;
import com.example.Main.domain.Post.entity.Post;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface PostCommentRepository extends JpaRepository<PostComment, Long> {
    List<PostComment> findByPost(Post post, Sort sort);

    // 게시글에 본인이 작성한 댓글 조회
    List<PostComment> findByPostIdAndAuthorEmail(Long postId, String email);

    // 대댓글 조회
    List<PostComment> findByParentCommentId(Long commentId, Sort sort);

    // 댓글에 본인이 작성한 대댓글 조회
    List<PostComment> findByParentCommentIdAndAuthorEmail(Long parentCommentId, String authorEmail);

    // 특정 게시글에 달린 모든 댓글 삭제
    void deleteByPostId(Long postId);
}
