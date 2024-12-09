package com.example.Main.domain.Report.repository;

import com.example.Main.domain.Report.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report,Long> {
    List<Report> findByPostId(Long postId);

    List<Report> findByReporterEmail(String userEmail);
}
