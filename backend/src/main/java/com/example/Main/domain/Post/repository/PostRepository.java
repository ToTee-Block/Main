package com.example.Main.domain.Post.repository;

import com.example.Main.domain.Post.entity.Post;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    // 게시글 전체 조회 (임시저장제외)
    List<Post> findAllByIsDraftFalse(Sort sort);

    // 게시글 전체 조회 (임시저장제외) - 개수 제한
    List<Post> findTopByIsDraftFalseOrderByIdAsc(Long limit);

    // 본인이 작성한 게시글 조회
    List<Post> findByAuthor_EmailAndIsDraftFalse(String authorEmail, Sort createdDate);

    // 제목과 내용에 키워드가 포함된 게시물 검색
    @Query("SELECT p FROM Post p " +
            "WHERE (p.subject LIKE %:keyword% OR p.content LIKE %:keyword%) " +
            "AND p.isDraft = false")
    List<Post> searchByKeyword(@Param("keyword") String keyword, Sort sort);

    // 임시 저장된 게시물 전체 조회
    List<Post> findByIsDraftTrue(Sort sort);

    // 본인이 임시저장한 게시글 조회
    List<Post> findByAuthor_EmailAndIsDraftTrue(String authorEmail, Sort sort);

}
