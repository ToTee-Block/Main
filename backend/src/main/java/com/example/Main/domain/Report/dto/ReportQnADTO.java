package com.example.Main.domain.Report.dto;

import com.example.Main.domain.Report.dto.summary.QnASummaryDTO;
import com.example.Main.domain.Report.entity.ReportQnA;
import lombok.Getter;

@Getter
public class ReportQnADTO {

    private final Long reportId;
    private final String reporterName;
    private final QnASummaryDTO qnA;
    private final String reason;
    private final String status;

    public ReportQnADTO(ReportQnA reportQnA) {
        this.reportId = reportQnA.getId();
        this.reporterName = reportQnA.getReporter() != null ? reportQnA.getReporter().getName() : "Unknown";
        this.qnA = reportQnA.getQnA() != null ? new QnASummaryDTO(reportQnA.getQnA()) : null;
        this.reason = reportQnA.getReason() != null ? reportQnA.getReason().getDescription() : null;
        this.status = reportQnA.getStatus() != null ? reportQnA.getStatus().getStatus() : null;
    }
}
