package com.example.Main.domain.Report.service;

import com.example.Main.domain.Member.entity.Member;
import com.example.Main.domain.Member.service.MemberService;
import com.example.Main.domain.Post.Comment.entity.PostComment;
import com.example.Main.domain.Post.Comment.service.PostCommentService;
import com.example.Main.domain.Report.dto.ReportCommentDTO;
import com.example.Main.domain.Report.entity.ReportComment;
import com.example.Main.domain.Report.eunums.ReportReason;
import com.example.Main.domain.Report.eunums.ReportStatus;
import com.example.Main.domain.Report.repository.ReportCommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportCommentService {

    private final ReportCommentRepository reportCommentRepository;
    private final PostCommentService postCommentService;
    private final MemberService memberService;


    // 댓글 신고
    @Transactional
    public ReportComment reportComment(Long commentId, String reporterEmail, ReportReason reason) {
        PostComment postComment = postCommentService.getComment(commentId)
                .orElseThrow(() -> new IllegalArgumentException("댓글을 찾을 수 없습니다."));


        Member reporter = memberService.getMemberByEmail(reporterEmail);
        if (reporter == null) {
            throw new IllegalArgumentException("신고자가 존재하지 않습니다.");
        }

        ReportComment reportComment = new ReportComment();
        reportComment.setPostComment(postComment);
        reportComment.setReporter(reporter);
        reportComment.setReason(reason);

        return reportCommentRepository.save(reportComment);
    }

    // 신고 상태 변경
    @Transactional
    public ReportComment updateReportStatus(Long reportId, ReportStatus status) {
        ReportComment reportComment = getReportById(reportId);
        reportComment.setStatus(status);
        return reportCommentRepository.save(reportComment);
    }

    // 댓글 중복 신고 여부 확인
    public boolean existsReport(Long commentId, String reporterEmail) {
        List<ReportComment> existingReports = reportCommentRepository.findByPostCommentIdAndReporterEmail(commentId, reporterEmail);
        return !existingReports.isEmpty();
    }

    // 댓글 존재 여부 확인
    public boolean existsComment(Long commentId) {
        return postCommentService.getComment(commentId).isPresent();
    }

    // 사용자가 신고한 댓글 내역 조회
    public List<ReportCommentDTO> getReportsByUser(String reporterEmail) {
        List<ReportComment> reportComments = reportCommentRepository.findByReporter_Email(reporterEmail);
        return reportComments.stream()
                .map(ReportCommentDTO::new)
                .collect(Collectors.toList());
    }

    // 특정 신고 ID에 해당하는 신고 내역을 조회하는 메서드
    public ReportComment getReportById(Long reportId) {
        return reportCommentRepository.findById(reportId)
                .orElseThrow(() -> new IllegalArgumentException("신고를 찾을 수 없습니다."));
    }

    // 모든 댓글 신고 내역 조회
    public List<ReportCommentDTO> getAllReports() {
        List<ReportComment> reportComments = reportCommentRepository.findAll();
        return reportComments.stream()
                .map(ReportCommentDTO::new)
                .collect(Collectors.toList());
    }
}
