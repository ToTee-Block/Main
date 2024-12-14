package com.example.Main.domain.Report.dto;

import com.example.Main.domain.Report.entity.ReportQnAComment;
import lombok.Getter;

@Getter
public class ReportQnACommentDTO {

    private final Long reportId;
    private final String reporterName;
    private final QnACommentSummaryDTO qnAComment;
    private final String reason;
    private final String status;

    public ReportQnACommentDTO(ReportQnAComment reportQnAComment) {
        this.reportId = reportQnAComment.getId();
        this.reporterName = reportQnAComment.getReporter() != null ? reportQnAComment.getReporter().getName() : "Unknown";
        this.qnAComment = new QnACommentSummaryDTO(reportQnAComment.getQnAComment());
        this.reason = reportQnAComment.getReason() != null ? reportQnAComment.getReason().getDescription() : null;
        this.status = reportQnAComment.getStatus() != null ? reportQnAComment.getStatus().getStatus() : null;
    }
}
