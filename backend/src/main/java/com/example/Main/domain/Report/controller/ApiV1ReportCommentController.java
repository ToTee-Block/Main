package com.example.Main.domain.Report.controller;

import com.example.Main.domain.Report.dto.ReportCommentDTO;
import com.example.Main.domain.Report.entity.ReportComment;
import com.example.Main.domain.Report.eunums.ReportReason;
import com.example.Main.domain.Report.eunums.ReportStatus;
import com.example.Main.domain.Report.service.ReportCommentService;
import com.example.Main.global.ErrorMessages.ErrorMessages;
import com.example.Main.global.RsData.RsData;
import com.example.Main.global.Security.SecurityMember;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/comments")
public class ApiV1ReportCommentController {

    private final ReportCommentService reportCommentService;

    // 댓글 신고
    // 예시 : /api/v1/comments/1/report?reason=1
    @PreAuthorize("isAuthenticated()")
    @PostMapping("/{commentId}/report")
    public RsData<ReportCommentDTO> reportComment(@PathVariable("commentId") Long commentId,
                                                  @RequestParam("reason") int reason,
                                                  Principal principal) {
        if (principal == null) {
            return RsData.of("401", ErrorMessages.UNAUTHORIZED, null);
        }

        String reporterEmail = principal.getName();
        ReportReason reportReason = ReportReason.fromCode(reason);

        if (!reportCommentService.existsComment(commentId)) {
            return RsData.of("404", ErrorMessages.NO_COMMENTS, null);
        }

        if (reportCommentService.existsReport(commentId, reporterEmail)) {
            return RsData.of("400", ErrorMessages.REPORT_ALREADY_EXISTS, null);
        }

        ReportComment reportComment = reportCommentService.reportComment(commentId, reporterEmail, reportReason);

        if (reportComment == null) {
            return RsData.of("400", ErrorMessages.REPORT_PROCESS_FAILED, null);
        }

        return RsData.of("201", "댓글 신고 성공", new ReportCommentDTO(reportComment));
    }

    // 전체 댓글의 본인 신고 내역
    // 예시 : /api/v1/comments/report/my
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/report/my")
    public RsData<List<ReportCommentDTO>> getReportsByUser(Principal principal) {
        if (principal == null) {
            return RsData.of("401", ErrorMessages.UNAUTHORIZED, null);
        }

        String reporterEmail = principal.getName();
        List<ReportCommentDTO> reportCommentDTOList = reportCommentService.getReportsByUser(reporterEmail);

        if (reportCommentDTOList.isEmpty()) {
            return RsData.of("404", ErrorMessages.REPORT_NOT_FOUND, null);
        }

        return RsData.of("200", "본인 댓글 신고 내역 조회 성공", reportCommentDTOList);
    }

    // 관리자 권한으로 댓글 신고 내역 조회
    // 예시 : /api/v1/comments/report/admin    @PreAuthorize("isAuthenticated()")
    @GetMapping("/report/admin")
    public ResponseEntity<RsData<List<ReportCommentDTO>>> getAllReports(@AuthenticationPrincipal SecurityMember loggedInUser) {
        if (loggedInUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(RsData.of("401", ErrorMessages.UNAUTHORIZED, null));
        }

        if (!loggedInUser.getAuthorities().toString().contains("ROLE_ADMIN")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(RsData.of("403", ErrorMessages.ONLY_ADMIN, null));
        }

        List<ReportCommentDTO> reportCommentDTOList = reportCommentService.getAllReports();

        if (reportCommentDTOList.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(RsData.of("404", ErrorMessages.REPORT_NOT_FOUND, null));
        }

        return ResponseEntity.ok(RsData.of("200", "전체 댓글 신고 내역 조회 성공", reportCommentDTOList));
    }

    // 댓글 신고 상태 변경
    // 예시 : /api/v1/comments/{commentId}/report/{reportId}
    @PreAuthorize("isAuthenticated()")
    @PatchMapping("/{commentId}/report/{reportId}")
    public ResponseEntity<RsData<ReportCommentDTO>> updateReportStatus(@PathVariable("reportId") Long reportId,
                                                                       @RequestParam("status") int status,
                                                                       @AuthenticationPrincipal SecurityMember loggedInUser) {
        if (loggedInUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(RsData.of("401", ErrorMessages.UNAUTHORIZED, null));
        }

        if (!loggedInUser.getAuthorities().toString().contains("ROLE_ADMIN")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(RsData.of("403", ErrorMessages.ONLY_ADMIN, null));
        }

        ReportComment reportComment = reportCommentService.getReportById(reportId);
        if (reportComment == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(RsData.of("404", ErrorMessages.REPORT_NOT_FOUND, null));
        }

        ReportStatus reportStatus = ReportStatus.fromCode(status);
        if (reportStatus == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(RsData.of("400", ErrorMessages.INVALID_REPORT_STATUS, null));
        }

        reportComment = reportCommentService.updateReportStatus(reportId, reportStatus);
        return ResponseEntity.ok(RsData.of("200", "댓글 신고 상태 업데이트 성공", new ReportCommentDTO(reportComment)));
    }
}
