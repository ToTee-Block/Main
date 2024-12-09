package com.example.Main.domain.Report.controller;

import com.example.Main.domain.Report.dto.ReportDTO;
import com.example.Main.domain.Report.entity.Report;
import com.example.Main.domain.Report.eunums.ReportReason;
import com.example.Main.domain.Report.eunums.ReportStatus;
import com.example.Main.domain.Report.service.ReportService;
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
@RequestMapping("/api/v1/post/{postId}")
@RequiredArgsConstructor
public class ApiV1ReportController {

    private final ReportService reportService;

    // 게시물 신고
    @PreAuthorize("isAuthenticated()")
    @PostMapping("/report")
    public RsData<ReportDTO> reportPost(@PathVariable("postId") Long postId,
                                        @RequestParam("reason") int reason,
                                        Principal principal) {
        String reporterEmail = principal.getName();
        ReportReason reportReason = ReportReason.fromCode(reason);

        // 게시물 신고 처리
        Report report = reportService.reportPost(postId, reporterEmail, reportReason);

        if (report == null) {
            return RsData.of("400", "신고 처리 실패", null);
        }

        // ReportDTO로 응답
        ReportDTO reportDTO = new ReportDTO(report);

        return RsData.of("200", "게시물 신고 성공", reportDTO);
    }

    // 신고 상태 변경 (예: 처리 완료) -> 문자열 사용
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PatchMapping("/report/{reportId}")
    public ResponseEntity<ReportDTO> updateReportStatus(@PathVariable("postId") Long postId,
                                                        @PathVariable("reportId") Long reportId,
                                                        @RequestParam("status") String status) {
        ReportStatus reportStatus = ReportStatus.fromStatus(status);

        // 신고 상태 업데이트
        Report updatedReport = reportService.updateReportStatus(reportId, reportStatus);

        // ReportDTO로 응답
        ReportDTO reportDTO = new ReportDTO(updatedReport);
        return new ResponseEntity<>(reportDTO, HttpStatus.OK);
    }

    // 게시물에 대한 신고 내역 조회 (관리자만 가능)
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/report")
    public ResponseEntity<List<ReportDTO>> getReportsForPost(@PathVariable("postId") Long postId,
                                                             @AuthenticationPrincipal SecurityMember loggedInUser) {
        List<ReportDTO> reportDTOList = reportService.getReportsForPost(postId);
        return new ResponseEntity<>(reportDTOList, HttpStatus.OK);
    }

    // 사용자가 신고한 내역 조회 (본인만 가능)
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/report/user")
    public RsData<List<ReportDTO>> getReportsByUser(@AuthenticationPrincipal SecurityMember loggedInUser) {
        String userEmail = loggedInUser.getEmail();
        List<ReportDTO> reportDTOList = reportService.getReportsByUser(userEmail);

        return RsData.of("200", "본인 신고 내역 조회 성공", reportDTOList);
    }
}
