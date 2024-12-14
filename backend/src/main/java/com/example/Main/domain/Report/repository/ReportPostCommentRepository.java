package com.example.Main.domain.Report.repository;

import com.example.Main.domain.Report.entity.ReportPostComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportPostCommentRepository extends JpaRepository<ReportPostComment, Long> {
    // 사용자가 신고한 댓글 내역을 조회하는 메서드
    List<ReportPostComment> findByReporter_Email(String reporterEmail);

    // 댓글 ID와 신고자 이메일로 중복 신고 여부를 확인하는 메서드
    List<ReportPostComment> findByPostCommentIdAndReporterEmail(Long commentId, String reporterEmail);
}
