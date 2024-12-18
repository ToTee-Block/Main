package com.example.Main.domain.Report.service;

import com.example.Main.domain.Member.entity.Member;
import com.example.Main.domain.Member.service.MemberService;
import com.example.Main.domain.Post.entity.Post;
import com.example.Main.domain.Post.service.PostService;
import com.example.Main.domain.Report.dto.ReportPostDTO;
import com.example.Main.domain.Report.entity.ReportPost;
import com.example.Main.domain.Report.enums.ReportReason;
import com.example.Main.domain.Report.enums.ReportStatus;
import com.example.Main.domain.Report.repository.ReportPostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportPostService {

    private final ReportPostRepository reportPostRepository;
    private final PostService postService;
    private final MemberService memberService;

    // 게시물 신고
    @Transactional
    public ReportPost reportPost(Long postId, String reporterEmail, ReportReason reason) {
        Post post = postService.getPost(postId);
        if (post == null) {
            throw new IllegalArgumentException("게시물이 존재하지 않습니다.");
        }

        Member reporter = memberService.getMemberByEmail(reporterEmail);
        if (reporter == null) {
            throw new IllegalArgumentException("신고자가 존재하지 않습니다.");
        }

        ReportPost reportPost = new ReportPost();
        reportPost.setPost(post);
        reportPost.setReporter(reporter);
        reportPost.setReason(reason);

        return reportPostRepository.save(reportPost);
    }

    // 신고 상태 변경
    @Transactional
    public ReportPost updateReportStatus(Long reportId, ReportStatus status) {
        ReportPost reportPost = getReportById(reportId);
        reportPost.setStatus(status);
        return reportPostRepository.save(reportPost);
    }
    // 사용자가 신고한 내역을 조회하는 메서드
    public List<ReportPostDTO> getReportsByUser(String reporterEmail) {
        List<ReportPost> reportPosts = reportPostRepository.findByReporter_Email(reporterEmail); // 이메일을 통해 신고 내역을 조회
        return reportPosts.stream()
                .map(ReportPostDTO::new)
                .collect(Collectors.toList());
    }

    // 모든 신고 내역을 조회하는 메서드
    public List<ReportPostDTO> getAllReports() {
        List<ReportPost> reportPosts = reportPostRepository.findAll();
        return reportPosts.stream().map(ReportPostDTO::new).collect(Collectors.toList());
    }

    // 특정 게시물에 대한 중복 신고 여부를 확인하는 메서드
    public boolean existsReport(Long postId, String reporterEmail) {
        List<ReportPost> existingReportPosts = reportPostRepository.findByPostIdAndReporterEmail(postId, reporterEmail);
        return !existingReportPosts.isEmpty();
    }

    // 특정 신고 ID에 해당하는 신고 내역을 조회하는 메서드
    public ReportPost getReportById(Long reportId) {
        return reportPostRepository.findById(reportId)
                .orElseThrow(() -> new IllegalArgumentException("신고를 찾을 수 없습니다."));
    }

    // 특정 게시물이 존재하는지 확인하는 메서드
    public boolean existsPost(Long postId) {
        Post post = postService.getPost(postId);
        return post != null;
    }
}
