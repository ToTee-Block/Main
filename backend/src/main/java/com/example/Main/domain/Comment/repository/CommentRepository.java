package com.example.Main.domain.Comment.repository;

import com.example.Main.domain.Comment.entity.Comment;
import com.example.Main.domain.Member.entity.Member;
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
    List<Comment> findByParentCommentId(Long commentId);
}
