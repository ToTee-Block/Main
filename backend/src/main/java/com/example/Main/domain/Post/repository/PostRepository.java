package com.example.Main.domain.Post.repository;

import com.example.Main.domain.Post.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findAllByIsDraftFalse();  // 임시 저장된 게시물 제외 전체 조회
    List<Post> findByIsDraftTrue(); // 임시 저장된 게시물 목록 조회

    // 제목과 내용에 키워드가 포함된 게시물 검색
    @Query("SELECT p FROM Post p WHERE (p.subject LIKE %:keyword% OR p.content LIKE %:keyword%) AND p.isDraft = false")
    List<Post> searchByKeyword(@Param("keyword") String keyword);

}
