package com.example.Main.domain.QnA.repository;

import com.example.Main.domain.Post.entity.Post;
import com.example.Main.domain.QnA.entity.QnA;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface QnARepository extends JpaRepository<QnA, Long> {

    // 게시글 전체 조회 (임시저장 제외)
    List<QnA> findAllByIsDraftFalse(Sort sort);

    // 본인이 작성한 게시글 조회
    List<QnA> findByAuthor_EmailAndIsDraftFalse(String authorEmail, Sort sort);

    // 제목, 내용, 작성자 이름으로 검색하는 메소드
    // ver - 전체 / 최신순
    @Query("SELECT q FROM QnA q JOIN q.author a WHERE " +
            "(LOWER(q.subject) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
            "OR LOWER(q.content) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
            "OR LOWER(a.name) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) " +
            "AND q.isDraft = false " +
            "ORDER BY q.createdDate DESC")
    Page<QnA> searchRecentQnAs(String searchTerm, Pageable pageable);

    // 제목과 내용에 키워드가 포함된 게시물 검색
    @Query("SELECT q FROM QnA q " +
            "WHERE (q.subject LIKE %:keyword% OR q.content LIKE %:keyword%) " +
            "AND q.isDraft = false")
    List<QnA> searchByKeyword(@Param("keyword") String keyword, Sort sort);

    // 임시 저장된 게시물 전체 조회
    List<QnA> findByIsDraftTrue(Sort sort);

    // 본인이 임시저장한 게시글 조회
    List<QnA> findByAuthor_EmailAndIsDraftTrue(String authorEmail, Sort sort);
}
