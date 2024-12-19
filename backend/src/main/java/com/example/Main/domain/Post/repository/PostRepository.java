package com.example.Main.domain.Post.repository;

import com.example.Main.domain.Member.entity.Member;
import com.example.Main.domain.Post.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    // 게시글 전체 조회 (임시저장제외)
    List<Post> findAllByIsDraftFalse(Sort sort);

    // 본인이 작성한 게시글 조회
    List<Post> findByAuthor_EmailAndIsDraftFalse(String authorEmail, Sort createdDate);
    // 본인이 작성한 게시글 조회
    @Query("SELECT p FROM Post p JOIN p.author a WHERE " +
            "(LOWER(p.subject) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
            "OR LOWER(p.content) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
            "OR LOWER(a.name) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) " +
            "AND a = :author " +
            "ORDER BY p.createdDate DESC")
    Page<Post> searchPostsByAuthor(String searchTerm, Pageable pageable, Member author);

    // 제목, 내용, 작성자 이름으로 검색하는 메소드
    // ver - 전체 / 최신순
    @Query("SELECT p FROM Post p JOIN p.author a WHERE " +
            "(LOWER(p.subject) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
            "OR LOWER(p.content) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
            "OR LOWER(a.name) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) " +
            "AND p.isDraft = false " +
            "ORDER BY p.createdDate DESC")
    Page<Post> searchRecentPosts(String searchTerm, Pageable pageable);
    // ver - 전체 / 인기순
    @Query("SELECT p FROM Post p JOIN p.author a WHERE " +
            "(LOWER(p.subject) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
            "OR LOWER(p.content) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
            "OR LOWER(a.name) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) " +
            "AND p.isDraft = false " +
            "AND p.likes >= 10 " +
            "ORDER BY p.likes DESC")
    Page<Post> searchHotPosts(String searchTerm, Pageable pageable);

    // 임시 저장된 게시물 전체 조회
    List<Post> findByIsDraftTrue(Sort sort);

    // 본인이 임시저장한 게시글 조회
    List<Post> findByAuthor_EmailAndIsDraftTrue(String authorEmail, Sort sort);

    // 관리자용 게시글 전체 조회 (임시저장 게시글 제외)
    Page<Post> findAllByIsDraftFalseOrderByCreatedDateDesc(Pageable pageable);
}
