package com.example.Main.domain.Report.eunums;

public enum ReportStatus {
    PENDING(1, "대기중"),
    COMPLETED(2, "처리완료"),
    REJECTED(3, "반려");

    private final int code;
    private final String status;

    // 생성자
    ReportStatus(int code, String status) {
        this.code = code;
        this.status = status;
    }

    // 숫자에 맞는 상태를 반환하는 메서드
    public static ReportStatus fromCode(int code) {
        for (ReportStatus reportStatus : ReportStatus.values()) {
            if (reportStatus.code == code) {
                return reportStatus;
            }
        }
        throw new IllegalArgumentException("Invalid status code: " + code);
    }

    // 상태 코드 반환
    public int getCode() {
        return code;
    }

    // 상태 설명 반환
    public String getStatus() {
        return status;
    }
}
