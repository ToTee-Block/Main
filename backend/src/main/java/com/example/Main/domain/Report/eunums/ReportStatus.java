package com.example.Main.domain.Report.eunums;

public enum ReportStatus {
    PENDING("대기 중"),
    COMPLETED("처리 완료"),
    REJECTED("반려");

    private final String status;

    ReportStatus(String status) {
        this.status = status;
    }

    public static ReportStatus fromStatus(String status) {
        for (ReportStatus reportStatus : ReportStatus.values()) {
            if (reportStatus.status.equalsIgnoreCase(status)) {
                return reportStatus;
            }
        }
        throw new IllegalArgumentException("Invalid status: " + status);
    }

    public String getStatus() {
        return status;
    }
}
