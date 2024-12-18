package com.example.Main.domain.Report.controller;

import com.example.Main.domain.Report.dto.ReportQnACommentDTO;
import com.example.Main.domain.Report.entity.ReportQnAComment;
import com.example.Main.domain.Report.enums.ReportReason;
import com.example.Main.domain.Report.service.ReportQnACommentService;
import com.example.Main.global.ErrorMessages.ErrorMessages;
import com.example.Main.global.RsData.RsData;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/qnas/comments")
public class ApiV1ReportQnACommentController {

    private final ReportQnACommentService reportQnACommentService;

    // QnA 댓글 신고
    @PreAuthorize("isAuthenticated()")
    @PostMapping("/{commentId}/reports")
    public RsData<ReportQnACommentDTO> reportQnAComment(@PathVariable("commentId") Long commentId,
                                                        @RequestParam("reason") int reason,
                                                        Principal principal) {
        if (principal == null) {
            return RsData.of("401", ErrorMessages.UNAUTHORIZED, null);
        }

        String reporterEmail = principal.getName();
        ReportReason reportReason = ReportReason.fromCode(reason);

        if (!reportQnACommentService.existsComment(commentId)) {
            return RsData.of("404", ErrorMessages.NO_COMMENTS, null);
        }

        if (reportQnACommentService.existsReport(commentId, reporterEmail)) {
            return RsData.of("400", ErrorMessages.REPORT_ALREADY_EXISTS, null);
        }

        ReportQnAComment reportQnAComment = reportQnACommentService.reportComment(commentId, reporterEmail, reportReason);

        if (reportQnAComment == null) {
            return RsData.of("400", ErrorMessages.REPORT_PROCESS_FAILED, null);
        }

        return RsData.of("201", "QnA 댓글 신고 성공", new ReportQnACommentDTO(reportQnAComment));
    }

    // 본인의 신고 내역 조회
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/reports/my")
    public RsData<List<ReportQnACommentDTO>> getReportsByUser(Principal principal) {
        if (principal == null) {
            return RsData.of("401", ErrorMessages.UNAUTHORIZED, null);
        }

        String reporterEmail = principal.getName();
        List<ReportQnACommentDTO> reportQnACommentDTOList = reportQnACommentService.getReportsByUser(reporterEmail);

        if (reportQnACommentDTOList.isEmpty()) {
            return RsData.of("404", ErrorMessages.REPORT_NOT_FOUND, null);
        }

        return RsData.of("200", "본인 QnA 댓글 신고 내역 조회 성공", reportQnACommentDTOList);
    }

}
