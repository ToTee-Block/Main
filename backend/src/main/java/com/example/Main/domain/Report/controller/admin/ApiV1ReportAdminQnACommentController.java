package com.example.Main.domain.Report.controller.admin;

import com.example.Main.domain.Report.dto.ReportQnACommentDTO;
import com.example.Main.domain.Report.entity.ReportQnAComment;
import com.example.Main.domain.Report.eunums.ReportStatus;
import com.example.Main.domain.Report.service.ReportQnACommentService;
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
@RequestMapping("/api/v1/admin/qnas/comments")
public class ApiV1ReportAdminQnACommentController {

    private final ReportQnACommentService reportQnACommentService;

    // 관리자 : QnA 댓글 신고 내역 조회
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/reports")
    public ResponseEntity<RsData<List<ReportQnACommentDTO>>> getAllReports(@AuthenticationPrincipal SecurityMember loggedInUser) {
        if (loggedInUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(RsData.of("401", ErrorMessages.UNAUTHORIZED, null));
        }

        if (!loggedInUser.getAuthorities().toString().contains("ROLE_ADMIN")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(RsData.of("403", ErrorMessages.ONLY_ADMIN, null));
        }

        List<ReportQnACommentDTO> reportQnACommentDTOList = reportQnACommentService.getAllReports();

        if (reportQnACommentDTOList.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(RsData.of("404", ErrorMessages.REPORT_NOT_FOUND, null));
        }

        return ResponseEntity.ok(RsData.of("200", "전체 QnA 댓글 신고 내역 조회 성공", reportQnACommentDTOList));
    }

    // 관리자 : QnA 댓글 신고 상태 변경
    @PreAuthorize("isAuthenticated()")
    @PatchMapping("/{commentId}/reports/{reportId}")
    public ResponseEntity<RsData<ReportQnACommentDTO>> updateReportStatus(@PathVariable("reportId") Long reportId,
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

        ReportQnAComment reportQnAComment = reportQnACommentService.getReportById(reportId);
        if (reportQnAComment == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(RsData.of("404", ErrorMessages.REPORT_NOT_FOUND, null));
        }

        ReportStatus reportStatus = ReportStatus.fromCode(status);
        if (reportStatus == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(RsData.of("400", ErrorMessages.INVALID_REPORT_STATUS, null));
        }

        reportQnAComment = reportQnACommentService.updateReportStatus(reportId, reportStatus);
        return ResponseEntity.ok(RsData.of("200", "QnA 댓글 신고 상태 업데이트 성공", new ReportQnACommentDTO(reportQnAComment)));
    }
}
