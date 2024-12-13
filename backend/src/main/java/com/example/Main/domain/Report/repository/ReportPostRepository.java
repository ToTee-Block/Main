package com.example.Main.domain.Report.repository;

import com.example.Main.domain.Post.entity.Post;
import com.example.Main.domain.Report.entity.ReportPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportPostRepository extends JpaRepository<ReportPost,Long> {
    // 사용자가 신고한 내역을 조회하는 메서드
    List<ReportPost> findByReporter_Email(String reporterEmail);

    // 특정 게시물에 대한 중복 신고 여부를 확인하는 메서드
    List<ReportPost> findByPostIdAndReporterEmail(Long postId, String reporterEmail);

    List<ReportPost> findByPost(Post post);
}
