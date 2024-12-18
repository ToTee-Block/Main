package com.example.Main.domain.Report.service;

import com.example.Main.domain.Member.entity.Member;
import com.example.Main.domain.Member.service.MemberService;
import com.example.Main.domain.QnA.entity.QnA;
import com.example.Main.domain.QnA.service.QnAService;
import com.example.Main.domain.Report.dto.ReportQnADTO;
import com.example.Main.domain.Report.entity.ReportQnA;
import com.example.Main.domain.Report.eunums.ReportReason;
import com.example.Main.domain.Report.eunums.ReportStatus;
import com.example.Main.domain.Report.repository.ReportQnARepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportQnAService {

    private final ReportQnARepository reportQnARepository;
    private final QnAService qnaService;
    private final MemberService memberService;

    @Transactional
    public ReportQnA reportQnA(Long qnaId, String reporterEmail, ReportReason reason) {
        QnA qna = qnaService.getQnA(qnaId);
        if (qna == null) {
            throw new IllegalArgumentException("QnA 게시물이 존재하지 않습니다.");
        }

        Member reporter = memberService.getMemberByEmail(reporterEmail);
        if (reporter == null) {
            throw new IllegalArgumentException("신고자가 존재하지 않습니다.");
        }

        ReportQnA reportQnA = new ReportQnA();
        reportQnA.setQnA(qna);
        reportQnA.setReporter(reporter);
        reportQnA.setReason(reason);

        return reportQnARepository.save(reportQnA);
    }

    @Transactional
    public ReportQnA updateReportStatus(Long reportId, ReportStatus status) {
        ReportQnA reportQnA = getReportById(reportId);
        reportQnA.setStatus(status);
        return reportQnARepository.save(reportQnA);
    }

    public List<ReportQnADTO> getReportsByUser(String reporterEmail) {
        List<ReportQnA> reportQnAS = reportQnARepository.findByReporter_Email(reporterEmail);
        return reportQnAS.stream()
                .map(ReportQnADTO::new)
                .collect(Collectors.toList());
    }

    public List<ReportQnADTO> getAllReports() {
        List<ReportQnA> reportQnAS = reportQnARepository.findAll();
        return reportQnAS.stream().map(ReportQnADTO::new).collect(Collectors.toList());
    }

    public boolean existsReport(Long qnaId, String reporterEmail) {
        List<ReportQnA> existingReportQnAS = reportQnARepository.findByQnAIdAndReporterEmail(qnaId, reporterEmail);
        return !existingReportQnAS.isEmpty();
    }

    public ReportQnA getReportById(Long reportId) {
        return reportQnARepository.findById(reportId)
                .orElseThrow(() -> new IllegalArgumentException("신고를 찾을 수 없습니다."));
    }

    public boolean existsQnA(Long qnaId) {
        QnA qna = qnaService.getQnA(qnaId);
        return qna != null;
    }
}
