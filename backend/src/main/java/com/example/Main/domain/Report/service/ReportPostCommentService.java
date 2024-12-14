package com.example.Main.domain.Report.service;

import com.example.Main.domain.Member.entity.Member;
import com.example.Main.domain.Member.service.MemberService;
import com.example.Main.domain.Post.Comment.entity.PostComment;
import com.example.Main.domain.Post.Comment.service.PostCommentService;
import com.example.Main.domain.Report.dto.ReportPostCommentDTO;
import com.example.Main.domain.Report.entity.ReportPostComment;
import com.example.Main.domain.Report.eunums.ReportReason;
import com.example.Main.domain.Report.eunums.ReportStatus;
import com.example.Main.domain.Report.repository.ReportPostCommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportPostCommentService {

    private final ReportPostCommentRepository reportPostCommentRepository;
    private final PostCommentService postCommentService;
    private final MemberService memberService;


    // 댓글 신고
    @Transactional
    public ReportPostComment reportComment(Long commentId, String reporterEmail, ReportReason reason) {
        PostComment postComment = postCommentService.getComment(commentId)
                .orElseThrow(() -> new IllegalArgumentException("댓글을 찾을 수 없습니다."));


        Member reporter = memberService.getMemberByEmail(reporterEmail);
        if (reporter == null) {
            throw new IllegalArgumentException("신고자가 존재하지 않습니다.");
        }

        ReportPostComment reportPostComment = new ReportPostComment();
        reportPostComment.setPostComment(postComment);
        reportPostComment.setReporter(reporter);
        reportPostComment.setReason(reason);

        return reportPostCommentRepository.save(reportPostComment);
    }

    // 신고 상태 변경
    @Transactional
    public ReportPostComment updateReportStatus(Long reportId, ReportStatus status) {
        ReportPostComment reportPostComment = getReportById(reportId);
        reportPostComment.setStatus(status);
        return reportPostCommentRepository.save(reportPostComment);
    }

    // 댓글 중복 신고 여부 확인
    public boolean existsReport(Long commentId, String reporterEmail) {
        List<ReportPostComment> existingReports = reportPostCommentRepository.findByPostCommentIdAndReporterEmail(commentId, reporterEmail);
        return !existingReports.isEmpty();
    }

    // 댓글 존재 여부 확인
    public boolean existsComment(Long commentId) {
        return postCommentService.getComment(commentId).isPresent();
    }

    // 사용자가 신고한 댓글 내역 조회
    public List<ReportPostCommentDTO> getReportsByUser(String reporterEmail) {
        List<ReportPostComment> reportPostComments = reportPostCommentRepository.findByReporter_Email(reporterEmail);
        return reportPostComments.stream()
                .map(ReportPostCommentDTO::new)
                .collect(Collectors.toList());
    }

    // 특정 신고 ID에 해당하는 신고 내역을 조회하는 메서드
    public ReportPostComment getReportById(Long reportId) {
        return reportPostCommentRepository.findById(reportId)
                .orElseThrow(() -> new IllegalArgumentException("신고를 찾을 수 없습니다."));
    }

    // 모든 댓글 신고 내역 조회
    public List<ReportPostCommentDTO> getAllReports() {
        List<ReportPostComment> reportPostComments = reportPostCommentRepository.findAll();
        return reportPostComments.stream()
                .map(ReportPostCommentDTO::new)
                .collect(Collectors.toList());
    }
}
