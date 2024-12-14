package com.example.Main.domain.Report.dto;

import com.example.Main.domain.Report.dto.summary.PostSummaryDTO;
import com.example.Main.domain.Report.entity.ReportPost;
import lombok.Getter;

@Getter
public class ReportPostDTO {

    private final Long reportId;
    private final String reporterName;
    private final PostSummaryDTO post;
    private final String reason;
    private final String status;

    public ReportPostDTO(ReportPost reportPost) {
        this.reportId = reportPost.getId();
        this.reporterName = reportPost.getReporter() != null ? reportPost.getReporter().getName() : "Unknown";
        this.post = reportPost.getPost() != null ? new PostSummaryDTO(reportPost.getPost()) : null;
        this.reason = reportPost.getReason() != null ? reportPost.getReason().getDescription() : null;
        this.status = reportPost.getStatus() != null ? reportPost.getStatus().getStatus() : null;
    }
}
