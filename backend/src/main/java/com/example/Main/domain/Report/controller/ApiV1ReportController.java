package com.example.Main.domain.Report.controller;

import com.example.Main.domain.Post.service.PostService;
import com.example.Main.domain.QnA.service.QnAService;
import com.example.Main.domain.Report.dto.ReportDTO;
import com.example.Main.domain.Report.dto.request.ReportRequest;
import com.example.Main.domain.Report.entity.Report;
import com.example.Main.domain.Report.enums.ReportReason;
import com.example.Main.domain.Report.service.ReportService;
import com.example.Main.domain.notification.service.NotificationService;
import com.example.Main.global.ErrorMessages.ErrorMessages;
import com.example.Main.global.RsData.RsData;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/reports")
public class ApiV1ReportController {

    private final ReportService reportService;
    private final PostService postService;
    private final QnAService qnAService;
    private final NotificationService notificationService;

    // 신고 선택지 출력
    @GetMapping("")
    public RsData getRepostSelections() {
        Map<Integer, String> reasons = ReportReason.toMap();
        return RsData.of("200", "신고 선택지 목록 성공", reasons);
    }

    // 게시물에 신고
    @PreAuthorize("isAuthenticated()")
    @PostMapping("/{targetType}/{targetId}")
    public RsData report (@PathVariable("targetType") String targetType,
                                        @PathVariable("targetId") Long targetId,
                                        @Valid @RequestBody ReportRequest reportRequest,
                                        Principal principal) {
        if (principal == null) {
            return RsData.of("401", ErrorMessages.UNAUTHORIZED, null);
        }

        String reporterEmail = principal.getName();
        ReportReason reportReason = ReportReason.fromCode(reportRequest.getReportCode());

        if (targetType.equals("post")) {
            if (this.postService.getPost(targetId) == null) {
                return RsData.of("404", ErrorMessages.POST_NOT_FOUND);
            }
        } else if (targetType.equals("qna")) {
            if (this.qnAService.getQnA(targetId) == null) {
                return RsData.of("404", ErrorMessages.QNA_NOT_FOUND);
            }
        } else {
            return RsData.of("404", String.format("잘못된 url 요청입니다: %s", targetType));
        }

        if (reportService.existsReport(targetType, targetId, reporterEmail)) {
            return RsData.of("400", ErrorMessages.ALREADY_REPORTED);
        }

        Report report = null;
        if (targetType.equals("post")) {
            report = reportService.reportPost(targetId, reporterEmail, reportReason);
        } else if (targetType.equals("qna")) {
            report = reportService.reportQnA(targetId, reporterEmail, reportReason);
        }
        if (report == null) {
            return RsData.of("400", ErrorMessages.REPORT_PROCESS_FAILED, null);
        }

        // 신고자에게 알림 전송
        notificationService.sendNotification(
                String.valueOf(report.getReporter().getId()),
                "신고가 되었습니다."
        );

        // 관리자에게 신고 알림 전송
        notificationService.sendNotificationToAdmins(
                "신고가 되었습니다. 관리자 확인이 필요합니다."
        );

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
}
