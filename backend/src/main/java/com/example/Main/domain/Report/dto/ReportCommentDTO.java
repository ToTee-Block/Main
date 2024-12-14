package com.example.Main.domain.Report.dto;

import com.example.Main.domain.Report.entity.ReportComment;
import lombok.Getter;

@Getter
public class ReportCommentDTO {

    private final Long reportId;
    private final String reporterName;
    private final PostCommentSummaryDTO postComment;
    private final String reason;
    private final String status;

    public ReportCommentDTO(ReportComment reportComment) {
        this.reportId = reportComment.getId();
        this.reporterName = reportComment.getReporter() != null ? reportComment.getReporter().getName() : "Unknown";
        this.postComment = new PostCommentSummaryDTO(reportComment.getPostComment());
        this.reason = reportComment.getReason() != null ? reportComment.getReason().getDescription() : null;
        this.status = reportComment.getStatus() != null ? reportComment.getStatus().getStatus() : null;
    }
}
