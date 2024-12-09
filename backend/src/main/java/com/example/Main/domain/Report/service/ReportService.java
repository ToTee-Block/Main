package com.example.Main.domain.Report.service;

import com.example.Main.domain.Member.entity.Member;
import com.example.Main.domain.Member.service.MemberService;
import com.example.Main.domain.Post.entity.Post;
import com.example.Main.domain.Post.service.PostService;
import com.example.Main.domain.Report.dto.ReportDTO;
import com.example.Main.domain.Report.entity.Report;
import com.example.Main.domain.Report.eunums.ReportReason;
import com.example.Main.domain.Report.eunums.ReportStatus;
import com.example.Main.domain.Report.repository.ReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;
    private final PostService postService;
    private final MemberService memberService;

    // 게시물 신고
    @Transactional
    public Report reportPost(Long postId, String reporterEmail, ReportReason reason) {
        Post post = postService.getPost(postId);
        Member reporter = memberService.getMemberByEmail(reporterEmail);

        Report report = new Report();
        report.setPost(post);
        report.setReporter(reporter);
        report.setReason(reason);

        return reportRepository.save(report);
    }

    // 신고 상태 변경 (예: 처리 완료)
    @Transactional
    public Report updateReportStatus(Long reportId, ReportStatus status) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new IllegalArgumentException("신고를 찾을 수 없습니다."));

        report.setStatus(status);
        return reportRepository.save(report);
    }

    // 신고 내역을 ReportDTO로 변환하여 반환
    public List<ReportDTO> getReportsForPost(Long postId) {
        List<Report> reports = reportRepository.findByPostId(postId);
        return reports.stream()
                .map(ReportDTO::new)
                .collect(Collectors.toList());
    }

    // 사용자가 신고한 내역을 ReportDTO로 변환하여 반환
    public List<ReportDTO> getReportsByUser(String userEmail) {
        List<Report> reports = reportRepository.findByReporterEmail(userEmail);
        return reports.stream()
                .map(ReportDTO::new)
                .collect(Collectors.toList());
    }
}
