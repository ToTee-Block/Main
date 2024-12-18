package com.example.Main.domain.Report.controller;

import com.example.Main.domain.Report.dto.ReportPostDTO;
import com.example.Main.domain.Report.entity.ReportPost;
import com.example.Main.domain.Report.eunums.ReportReason;
import com.example.Main.domain.Report.service.ReportPostService;
import com.example.Main.domain.notification.service.NotificationService;
import com.example.Main.global.ErrorMessages.ErrorMessages;
import com.example.Main.global.RsData.RsData;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/posts")
public class ApiV1ReportPostController {

    private final ReportPostService reportPostService;
    private final NotificationService notificationService;

    // 게시글 신고
    @PreAuthorize("isAuthenticated()")
    @PostMapping("/{postId}/reports")
    public RsData<ReportPostDTO> reportPost(@PathVariable("postId") Long postId,
                                            @RequestParam("reason") int reason,
                                            Principal principal) {
        if (principal == null) {
            return RsData.of("401", ErrorMessages.UNAUTHORIZED, null);
        }

        String reporterEmail = principal.getName();
        ReportReason reportReason = ReportReason.fromCode(reason);

        if (!reportPostService.existsPost(postId)) {
            return RsData.of("404", ErrorMessages.POST_NOT_FOUND, null);
        }

        if (reportPostService.existsReport(postId, reporterEmail)) {
            return RsData.of("400", ErrorMessages.POST_ALREADY_REPORTED, null);
        }

        ReportPost reportPost = reportPostService.reportPost(postId, reporterEmail, reportReason);

        if (reportPost == null) {
            return RsData.of("400", ErrorMessages.REPORT_PROCESS_FAILED, null);
        }

        // 신고자에게 신고 접수 알림 전송
        notificationService.sendNotification(
                reporterEmail,
                "'%s'가 신고되었습니다. 관리자 검토 후 처리할 예정입니다.".formatted(reportPost.getPost().getSubject())
        );

        // 관리자에게 게시물 신고 알림 전송
        notificationService.sendNotificationToAdmins(
                "'%s'가 신고되었습니다. 관리자 확인이 필요합니다.".formatted(reportPost.getPost().getSubject())
        );


        return RsData.of("201", "게시물 신고 성공", new ReportPostDTO(reportPost));
    }

    // 본인의 게시글 신고 내역 조회
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/reports/my")
    public RsData<List<ReportPostDTO>> getReportsByUser(Principal principal) {
        if (principal == null) {
            return RsData.of("401", ErrorMessages.UNAUTHORIZED, null);
        }

        String reporterEmail = principal.getName();
        List<ReportPostDTO> reportPostDTOList = reportPostService.getReportsByUser(reporterEmail);

        if (reportPostDTOList.isEmpty()) {
            return RsData.of("404", ErrorMessages.REPORT_NOT_FOUND, null);
        }

        return RsData.of("200", "본인 신고 내역 조회 성공", reportPostDTOList);
    }
}
