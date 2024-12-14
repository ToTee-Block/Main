package com.example.Main.domain.Report.repository;

import com.example.Main.domain.Post.entity.Post;
import com.example.Main.domain.QnA.entity.QnA;
import com.example.Main.domain.Report.entity.ReportPost;
import com.example.Main.domain.Report.entity.ReportQnA;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportQnARepository extends JpaRepository<ReportQnA,Long> {
    // 사용자가 신고한 내역을 조회하는 메서드
    List<ReportQnA> findByReporter_Email(String reporterEmail);

    // 특정 QNA에 대한 중복 신고 여부를 확인하는 메서드
    List<ReportQnA> findByQnAIdAndReporterEmail(Long qnaId, String reporterEmail);

    List<ReportQnA> findByQnA(QnA qnA);

    List<ReportQnA> findByQnAId(Long qnAId);
}
