package com.example.Main.domain.Report.controller;

import com.example.Main.domain.Report.dto.ReportDTO;
import com.example.Main.domain.Report.entity.Report;
import com.example.Main.domain.Report.eunums.ReportReason;
import com.example.Main.domain.Report.eunums.ReportStatus;
import com.example.Main.domain.Report.service.ReportService;
import com.example.Main.global.ErrorMessages.ErrorMessages;
import com.example.Main.global.RsData.RsData;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/post")
public class ApiV1ReportController {

    private final ReportService reportService;

    // 게시물에 신고
    // 예시 : api/v1/post/1/report?reason=1
    @PreAuthorize("isAuthenticated()")
    @PostMapping("/{postId}/report")
    public RsData<ReportDTO> reportPost(@PathVariable("postId") Long postId,
                                        @RequestParam("reason") int reason,
                                        Principal principal) {
        if (principal == null) {
            return RsData.of("401", ErrorMessages.UNAUTHORIZED, null);
        }

        String reporterEmail = principal.getName();
        ReportReason reportReason = ReportReason.fromCode(reason);

        if (!reportService.existsPost(postId)) {
            return RsData.of("404", ErrorMessages.POST_NOT_FOUND, null);
        }

        if (reportService.existsReport(postId, reporterEmail)) {
            return RsData.of("400", ErrorMessages.POST_ALREADY_REPORTED, null);
        }

        Report report = reportService.reportPost(postId, reporterEmail, reportReason);

        if (report == null) {
            return RsData.of("400", ErrorMessages.REPORT_PROCESS_FAILED, null);
        }

        return RsData.of("201", "게시물 신고 성공", new ReportDTO(report));
    }

    // 전체 게시물의 본인 신고 내역
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/report/my")
    public RsData<List<ReportDTO>> getReportsByUser(Principal principal) {
        if (principal == null) {
            return RsData.of("401", ErrorMessages.UNAUTHORIZED, null);
        }

        String reporterEmail = principal.getName();
        List<ReportDTO> reportDTOList = reportService.getReportsByUser(reporterEmail);

        if (reportDTOList.isEmpty()) {
            return RsData.of("404", ErrorMessages.REPORT_NOT_FOUND, null);
        }

        return RsData.of("200", "본인 신고 내역 조회 성공", reportDTOList);
    }

    // 전체 게시물의 신고 내역 > 관리자 권한으로 변경예정
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/report/admin")
    public ResponseEntity<RsData<List<ReportDTO>>> getAllReports(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(RsData.of("401", ErrorMessages.UNAUTHORIZED, null));
        }

        List<ReportDTO> reportDTOList = reportService.getAllReports();

        if (reportDTOList.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(RsData.of("404", ErrorMessages.USER_REPORT_NOT_FOUND, null));
        }

        return ResponseEntity.ok(RsData.of("200", "전체 신고 내역 조회 성공", reportDTOList));
    }

    // 특정 게시물의 신고상태 변경 > 관리자 권한으로 변경예정
    // 예시 : api/v1/post/1/report/3?status=1
    @PreAuthorize("isAuthenticated()")
    @PatchMapping("/{postId}/report/{reportId}")
    public ResponseEntity<RsData<ReportDTO>> updateReportStatus(@PathVariable("reportId") Long reportId,
                                                                @RequestParam("status") int status,
                                                                Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(RsData.of("401", ErrorMessages.UNAUTHORIZED, null));
        }

        Report report = reportService.getReportById(reportId);
        if (report == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(RsData.of("404", ErrorMessages.REPORT_NOT_FOUND, null));
        }

        ReportStatus reportStatus = ReportStatus.fromCode(status);
        if (reportStatus == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(RsData.of("400", ErrorMessages.INVALID_REPORT_STATUS, null));
        }

        report = reportService.updateReportStatus(reportId, reportStatus);
        return ResponseEntity.ok(RsData.of("200", "신고 상태 업데이트 성공", new ReportDTO(report)));
    }
}
