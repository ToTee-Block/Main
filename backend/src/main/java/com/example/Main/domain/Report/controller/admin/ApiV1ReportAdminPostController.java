package com.example.Main.domain.Report.controller.admin;

import com.example.Main.domain.Report.dto.ReportPostDTO;
import com.example.Main.domain.Report.entity.ReportPost;
import com.example.Main.domain.Report.enums.ReportStatus;
import com.example.Main.domain.Report.service.ReportPostService;
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
@RequestMapping("/api/v1/admin/posts")
public class ApiV1ReportAdminPostController {

    private final ReportPostService reportPostService;


    // 관리자 : 게시글 댓글 신고 내역 조회
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/reports")
    public ResponseEntity<RsData<List<ReportPostDTO>>> getAllReports(@AuthenticationPrincipal SecurityMember loggedInUser) {
        if (loggedInUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(RsData.of("401", ErrorMessages.UNAUTHORIZED, null));
        }

        // 권한 체크
        String role = loggedInUser.getAuthorities().toString();
        if (!role.contains("ROLE_ADMIN")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(RsData.of("403", ErrorMessages.ONLY_ADMIN, null));
        }

        List<ReportPostDTO> reportPostDTOList = reportPostService.getAllReports();

        if (reportPostDTOList.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(RsData.of("404", ErrorMessages.USER_REPORT_NOT_FOUND, null));
        }

        return ResponseEntity.ok(RsData.of("200", "전체 신고 내역 조회 성공", reportPostDTOList));
    }

    // 관리자 : 게시글 신고 상태 변경
    @PreAuthorize("isAuthenticated()")
    @PatchMapping("/{postId}/reports/{reportId}")
    public ResponseEntity<RsData<ReportPostDTO>> updateReportStatus(@PathVariable("reportId") Long reportId,
                                                                    @RequestParam("status") int status,
                                                                    @AuthenticationPrincipal SecurityMember loggedInUser) {
        if (loggedInUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(RsData.of("401", ErrorMessages.UNAUTHORIZED, null));
        }

        // 권한 체크
        String role = loggedInUser.getAuthorities().toString();
        if (!role.contains("ROLE_ADMIN")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(RsData.of("403", ErrorMessages.ONLY_ADMIN, null));
        }

        ReportPost reportPost = reportPostService.getReportById(reportId);
        if (reportPost == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(RsData.of("404", ErrorMessages.REPORT_NOT_FOUND, null));
        }

        ReportStatus reportStatus = ReportStatus.fromCode(status);
        if (reportStatus == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(RsData.of("400", ErrorMessages.INVALID_REPORT_STATUS, null));
        }

        reportPost = reportPostService.updateReportStatus(reportId, reportStatus);
        return ResponseEntity.ok(RsData.of("200", "신고 상태 업데이트 성공", new ReportPostDTO(reportPost)));
    }
}
