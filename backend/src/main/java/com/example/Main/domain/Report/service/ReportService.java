package com.example.Main.domain.Report.service;

import com.example.Main.domain.Member.entity.Member;
import com.example.Main.domain.Member.service.MemberService;
import com.example.Main.domain.Post.entity.Post;
import com.example.Main.domain.Post.service.PostService;
import com.example.Main.domain.QnA.entity.QnA;
import com.example.Main.domain.QnA.service.QnAService;
import com.example.Main.domain.Report.dto.ReportDTO;
import com.example.Main.domain.Report.entity.Report;
import com.example.Main.domain.Report.enums.ReportReason;
import com.example.Main.domain.Report.enums.ReportStatus;
import com.example.Main.domain.Report.repository.ReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;
    private final PostService postService;
    private final QnAService qnAService;
    private final MemberService memberService;

    // 게시물 신고
    @Transactional
    public Report reportPost(Long postID, String reporterEmail, ReportReason reason) {
            Post post = postService.getPost(postID);
            if (post == null) {
                throw new IllegalArgumentException("게시물이 존재하지 않습니다.");
            }

            Member reporter = memberService.getMemberByEmail(reporterEmail);
            if (reporter == null) {
                throw new IllegalArgumentException("신고자가 존재하지 않습니다.");
            }

            Report report = new Report();
            report.setType("post");
            report.setPost(post);
            report.setReporter(reporter);
            report.setReason(reason);

            return reportRepository.save(report);
    }

    // QNA 신고
    @Transactional
    public Report reportQnA(Long qnAId, String reporterEmail, ReportReason reason) {
        QnA qna = qnAService.getQnA(qnAId);
        if (qna == null) {
            throw new IllegalArgumentException("게시물이 존재하지 않습니다.");
        }

        Member reporter = memberService.getMemberByEmail(reporterEmail);
        if (reporter == null) {
            throw new IllegalArgumentException("신고자가 존재하지 않습니다.");
        }

        Report report = new Report();
        report.setType("qna");
        report.setQnA(qna);
        report.setReporter(reporter);
        report.setReason(reason);

        return reportRepository.save(report);
    }

    // 신고 상태 변경
    @Transactional
    public Report updateReportStatus(Long reportId, ReportStatus status) {
        Report report = getReportById(reportId);
        report.setStatus(status);
        return reportRepository.save(report);
    }
    // 사용자가 신고한 내역을 조회하는 메서드
    public List<ReportDTO> getReportsByUser(String reporterEmail) {
        List<Report> reports = reportRepository.findByReporter_Email(reporterEmail); // 이메일을 통해 신고 내역을 조회
        return reports.stream()
                .map(ReportDTO::new)
                .collect(Collectors.toList());
    }

    // 모든 신고 내역을 조회하는 메서드
    public List<ReportDTO> getAllReports() {
        List<Report> reports = reportRepository.findAll();
        return reports.stream().map(ReportDTO::new).collect(Collectors.toList());
    }

    // 특정 게시물에 대한 중복 신고 여부를 확인하는 메서드
    public boolean existsReport(String targetType, Long targetId, String reporterEmail) {
        List<Report> existingReports = new ArrayList<>();
        if (targetType == "post") {
            existingReports = reportRepository.findByPostIdAndReporterEmail(targetId, reporterEmail);
        } else if (targetType == "qna") {
            existingReports = reportRepository.findByQnAIdAndReporterEmail(targetId, reporterEmail);
        }
        return !existingReports.isEmpty();
    }

    // 특정 신고 ID에 해당하는 신고 내역을 조회하는 메서드
    public Report getReportById(Long reportId) {
        return reportRepository.findById(reportId)
                .orElseThrow(() -> new IllegalArgumentException("신고를 찾을 수 없습니다."));
    }

    // 특정 게시물이 존재하는지 확인하는 메서드
    public boolean existsPost(Long postId) {
        Post post = postService.getPost(postId);
        return post != null;
    }
}
