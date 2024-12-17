package com.example.Main.domain.Report.dto;

import com.example.Main.domain.Member.entity.Member;
import com.example.Main.domain.Report.entity.Report;
import lombok.Getter;

@Getter
public class ReportDTO {

    private final Long reportId;
    private final String reporterName;
    private final PostSummaryDTO post;
    private final String reason;
    private final String status;

    public ReportDTO(Report report) {
        this.reportId = report.getId();
        this.reporterName = report.getReporter() != null ? report.getReporter().getName() : "Unknown";
        this.post = report.getPost() != null ? new PostSummaryDTO(report.getPost()) : null;
        this.reason = report.getReason() != null ? report.getReason().getDescription() : null;
        this.status = report.getStatus() != null ? report.getStatus().getStatus() : null;
    }
}
