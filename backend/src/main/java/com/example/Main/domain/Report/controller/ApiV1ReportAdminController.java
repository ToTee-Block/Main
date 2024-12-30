package com.example.Main.domain.Report.controller;

import com.example.Main.domain.Report.dto.ReportDTO;
import com.example.Main.domain.Report.entity.Report;
import com.example.Main.domain.Report.enums.ReportStatus;
import com.example.Main.domain.Report.service.ReportService;
import com.example.Main.global.ErrorMessages.ErrorMessages;
import com.example.Main.global.RsData.RsData;
import com.example.Main.global.Security.SecurityMember;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin/reports")
public class ApiV1ReportAdminController {

    private final ReportService reportService;

    // 관리자 : 게시글 및 QnA 신고 내역 조회
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping
    public ResponseEntity<RsData<List<ReportDTO>>> getAllReports(@AuthenticationPrincipal SecurityMember loggedInUser) {
        if (loggedInUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(RsData.of("401", ErrorMessages.UNAUTHORIZED, null));
        }

        List<ReportDTO> reportDTOList = reportService.getAllReports();

        if (reportDTOList.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(RsData.of("404", ErrorMessages.REPORT_NOT_FOUND, null));
        }

        return ResponseEntity.ok(RsData.of("200", "전체 신고 내역 조회 성공", reportDTOList));
    }

    // 관리자 : 게시글 및 QnA 신고 상태 변경
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PatchMapping("/{targetType}/{targetId}/{reportId}")
    public ResponseEntity<RsData<ReportDTO>> updateReportStatus(@PathVariable("targetType") String targetType,
                                                                @PathVariable("targetId") Long targetId,
                                                                @PathVariable("reportId") Long reportId,
                                                                @RequestParam("status") int status,
                                                                @AuthenticationPrincipal SecurityMember loggedInUser) {

        if (loggedInUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(RsData.of("401", ErrorMessages.UNAUTHORIZED, null));
        }

        Report report = reportService.getReportById(reportId);
        if (report == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(RsData.of("404", ErrorMessages.REPORT_NOT_FOUND, null));
        }

        if (!targetType.equals("post") && !targetType.equals("qna")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(RsData.of("400", String.format("잘못된 요청입니다: %s", targetType), null));
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
