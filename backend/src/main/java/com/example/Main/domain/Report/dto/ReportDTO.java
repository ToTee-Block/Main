package com.example.Main.domain.Report.dto;

import com.example.Main.domain.Report.dto.summary.SummaryDTO;
import com.example.Main.domain.Report.entity.Report;
import lombok.Getter;

@Getter
public class ReportDTO {

    private final Long reportId;
    private final String reporterName;
    private final Object target;
    private final String reason;
    private final String status;

    public ReportDTO(Report report) {
        this.reportId = report.getId();
        this.reporterName = report.getReporter() != null ? report.getReporter().getName() : "Unknown";
        this.reason = report.getReason() != null ? report.getReason().getDescription() : null;
        this.status = report.getStatus() != null ? report.getStatus().getStatus() : null;

        if (report.getPost() != null) {
            this.target = new SummaryDTO(report.getPost());
        } else if (report.getQnA() != null) {
            this.target = new SummaryDTO(report.getQnA());
        } else {
            this.target = null;
        }
    }
}
