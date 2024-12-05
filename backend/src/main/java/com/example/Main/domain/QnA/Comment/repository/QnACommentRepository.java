package com.example.Main.domain.QnA.Comment.repository;

import com.example.Main.domain.QnA.Comment.entity.QnAComment;
import com.example.Main.domain.QnA.entity.QnA;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QnACommentRepository extends JpaRepository<QnAComment, Long> {
    // QnA 조회
    List<QnAComment> findByQnA(QnA qnA, Sort sort);

    // QnA에 본인이 작성한 댓글 조회
    List<QnAComment> findByQnAIdAndAuthorEmail(Long qnAId, String email);

    // 대댓글 조회
    List<QnAComment> findByParentCommentId(Long commentId, Sort sort);

    // 댓글에 본인이 작성한 대댓글 조회
    List<QnAComment> findByParentCommentIdAndAuthorEmail(Long parentCommentId, String authorEmail);
}
