package com.example.Main.domain.Report.dto;

import com.example.Main.domain.Report.entity.ReportPostComment;
import lombok.Getter;

@Getter
public class ReportPostCommentDTO {

    private final Long reportId;
    private final String reporterName;
    private final PostCommentSummaryDTO postComment;
    private final String reason;
    private final String status;

    public ReportPostCommentDTO(ReportPostComment reportPostComment) {
        this.reportId = reportPostComment.getId();
        this.reporterName = reportPostComment.getReporter() != null ? reportPostComment.getReporter().getName() : "Unknown";
        this.postComment = new PostCommentSummaryDTO(reportPostComment.getPostComment());
        this.reason = reportPostComment.getReason() != null ? reportPostComment.getReason().getDescription() : null;
        this.status = reportPostComment.getStatus() != null ? reportPostComment.getStatus().getStatus() : null;
    }
}
