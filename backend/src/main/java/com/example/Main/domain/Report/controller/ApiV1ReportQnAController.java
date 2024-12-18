package com.example.Main.domain.Report.controller;

import com.example.Main.domain.Report.dto.ReportQnADTO;
import com.example.Main.domain.Report.entity.ReportQnA;
import com.example.Main.domain.Report.eunums.ReportReason;
import com.example.Main.domain.Report.service.ReportQnAService;
import com.example.Main.global.ErrorMessages.ErrorMessages;
import com.example.Main.global.RsData.RsData;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/qnas")
public class ApiV1ReportQnAController {

    private final ReportQnAService reportQnAService;

    // QnA 신고
    @PreAuthorize("isAuthenticated()")
    @PostMapping("/{qnAId}/reports")
    public RsData<ReportQnADTO> reportQnA(@PathVariable("qnAId") Long qnAId,
                                          @RequestParam("reason") int reason,
                                          Principal principal) {
        if (principal == null) {
            return RsData.of("401", ErrorMessages.UNAUTHORIZED, null);
        }

        String reporterEmail = principal.getName();
        ReportReason reportReason = ReportReason.fromCode(reason);

        if (!reportQnAService.existsQnA(qnAId)) {
            return RsData.of("404", ErrorMessages.QNA_NOT_FOUND, null);
        }

        if (reportQnAService.existsReport(qnAId, reporterEmail)) {
            return RsData.of("400", ErrorMessages.QNA_ALREADY_REPORTED, null);
        }

        ReportQnA reportQnA = reportQnAService.reportQnA(qnAId, reporterEmail, reportReason);

        if (reportQnA == null) {
            return RsData.of("400", ErrorMessages.REPORT_PROCESS_FAILED, null);
        }

        return RsData.of("201", "QnA 게시물 신고 성공", new ReportQnADTO(reportQnA));
    }
    // 본인의 QnA 신고 내역 조회
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/reports/my")
    public RsData<List<ReportQnADTO>> getReportsByUser(Principal principal) {
        if (principal == null) {
            return RsData.of("401", ErrorMessages.UNAUTHORIZED, null);
        }

        String reporterEmail = principal.getName();
        List<ReportQnADTO> reportQnADTOList = reportQnAService.getReportsByUser(reporterEmail);

        if (reportQnADTOList.isEmpty()) {
            return RsData.of("404", ErrorMessages.REPORT_NOT_FOUND, null);
        }

        return RsData.of("200", "본인 신고 내역 조회 성공", reportQnADTOList);
    }

}
