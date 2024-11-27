package com.example.Main.domain.Post.repository;

import com.example.Main.domain.Post.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findAllByIsDraftFalse();  // 임시 저장된 게시물 제외 전체 조회
    List<Post> findByIsDraftTrue(); // 임시 저장된 게시물 목록 조회
}
