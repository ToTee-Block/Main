package com.example.Main.domain.Report.controller;

import com.example.Main.domain.Report.dto.ReportPostCommentDTO;
import com.example.Main.domain.Report.entity.ReportPostComment;
import com.example.Main.domain.Report.enums.ReportReason;
import com.example.Main.domain.Report.service.ReportPostCommentService;
import com.example.Main.global.ErrorMessages.ErrorMessages;
import com.example.Main.global.RsData.RsData;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/posts/comments")
public class ApiV1ReportPostCommentController {

    private final ReportPostCommentService reportPostCommentService;

    // 게시글 댓글 신고
    @PreAuthorize("isAuthenticated()")
    @PostMapping("/{commentId}/reports")
    public RsData<ReportPostCommentDTO> reportComment(@PathVariable("commentId") Long commentId,
                                                      @RequestParam("reason") int reason,
                                                      Principal principal) {
        if (principal == null) {
            return RsData.of("401", ErrorMessages.UNAUTHORIZED, null);
        }

        String reporterEmail = principal.getName();
        ReportReason reportReason = ReportReason.fromCode(reason);

        if (!reportPostCommentService.existsComment(commentId)) {
            return RsData.of("404", ErrorMessages.NO_COMMENTS, null);
        }

        if (reportPostCommentService.existsReport(commentId, reporterEmail)) {
            return RsData.of("400", ErrorMessages.REPORT_ALREADY_EXISTS, null);
        }

        ReportPostComment reportPostComment = reportPostCommentService.reportComment(commentId, reporterEmail, reportReason);

        if (reportPostComment == null) {
            return RsData.of("400", ErrorMessages.REPORT_PROCESS_FAILED, null);
        }

        return RsData.of("201", "댓글 신고 성공", new ReportPostCommentDTO(reportPostComment));
    }

    // 본인의 게시글 신고 내역 조회
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/reports/my")
    public RsData<List<ReportPostCommentDTO>> getReportsByUser(Principal principal) {
        if (principal == null) {
            return RsData.of("401", ErrorMessages.UNAUTHORIZED, null);
        }

        String reporterEmail = principal.getName();
        List<ReportPostCommentDTO> reportPostCommentDTOList = reportPostCommentService.getReportsByUser(reporterEmail);

        if (reportPostCommentDTOList.isEmpty()) {
            return RsData.of("404", ErrorMessages.REPORT_NOT_FOUND, null);
        }

        return RsData.of("200", "본인 댓글 신고 내역 조회 성공", reportPostCommentDTOList);
    }
}
