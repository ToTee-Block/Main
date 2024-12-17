package com.example.Main.domain.Report.service;

import com.example.Main.domain.Member.entity.Member;
import com.example.Main.domain.Member.service.MemberService;
import com.example.Main.domain.QnA.Comment.entity.QnAComment;
import com.example.Main.domain.QnA.Comment.service.QnACommentService;
import com.example.Main.domain.Report.dto.ReportQnACommentDTO;
import com.example.Main.domain.Report.entity.ReportQnAComment;
import com.example.Main.domain.Report.eunums.ReportReason;
import com.example.Main.domain.Report.eunums.ReportStatus;
import com.example.Main.domain.Report.repository.ReportQnACommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportQnACommentService {

    private final ReportQnACommentRepository reportQnACommentRepository;
    private final QnACommentService qnACommentService;
    private final MemberService memberService;

    @Transactional
    public ReportQnAComment reportComment(Long commentId, String reporterEmail, ReportReason reason) {
        QnAComment qnAComment = qnACommentService.getComment(commentId)
                .orElseThrow(() -> new IllegalArgumentException("댓글을 찾을 수 없습니다."));

        Member reporter = memberService.getMemberByEmail(reporterEmail);
        if (reporter == null) {
            throw new IllegalArgumentException("신고자가 존재하지 않습니다.");
        }

        ReportQnAComment reportQnAComment = new ReportQnAComment();
        reportQnAComment.setQnAComment(qnAComment);
        reportQnAComment.setReporter(reporter);
        reportQnAComment.setReason(reason);

        return reportQnACommentRepository.save(reportQnAComment);
    }

    @Transactional
    public ReportQnAComment updateReportStatus(Long reportId, ReportStatus status) {
        ReportQnAComment reportQnAComment = getReportById(reportId);
        reportQnAComment.setStatus(status);
        return reportQnACommentRepository.save(reportQnAComment);
    }

    public boolean existsReport(Long commentId, String reporterEmail) {
        List<ReportQnAComment> existingReports = reportQnACommentRepository.findByQnACommentIdAndReporterEmail(commentId, reporterEmail);
        return !existingReports.isEmpty();
    }

    public boolean existsComment(Long commentId) {
        return qnACommentService.getComment(commentId).isPresent();
    }

    public List<ReportQnACommentDTO> getReportsByUser(String reporterEmail) {
        List<ReportQnAComment> reportQnAComments = reportQnACommentRepository.findByReporter_Email(reporterEmail);
        return reportQnAComments.stream()
                .map(ReportQnACommentDTO::new)
                .collect(Collectors.toList());
    }

    public ReportQnAComment getReportById(Long reportId) {
        return reportQnACommentRepository.findById(reportId)
                .orElseThrow(() -> new IllegalArgumentException("신고를 찾을 수 없습니다."));
    }

    public List<ReportQnACommentDTO> getAllReports() {
        List<ReportQnAComment> reportQnAComments = reportQnACommentRepository.findAll();
        return reportQnAComments.stream()
                .map(ReportQnACommentDTO::new)
                .collect(Collectors.toList());
    }
}
