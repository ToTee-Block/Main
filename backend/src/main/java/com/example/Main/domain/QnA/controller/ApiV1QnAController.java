package com.example.Main.domain.QnA.controller;

import com.example.Main.domain.Member.service.MemberService;
import com.example.Main.domain.QnA.dto.QnADTO;
import com.example.Main.domain.QnA.dto.request.QnACreateRequest;
import com.example.Main.domain.QnA.dto.request.QnAModifyRequest;
import com.example.Main.domain.QnA.dto.response.QnACreateResponse;
import com.example.Main.domain.QnA.dto.response.QnAModifyResponse;
import com.example.Main.domain.QnA.dto.response.QnAResponse;
import com.example.Main.domain.QnA.dto.response.QnAsResponse;
import com.example.Main.domain.QnA.entity.QnA;
import com.example.Main.domain.QnA.service.QnAService;
import com.example.Main.global.RsData.RsData;
import com.example.Main.global.Util.Markdown.MarkdownService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/api/v1/qna")
public class ApiV1QnAController {
    private final QnAService qnAService;
    private final MemberService memberService;
    private final MarkdownService markdownService;

    // 검색
    @GetMapping("/search")
    public RsData<QnAsResponse> search(@RequestParam("keyword") String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return RsData.of("400", "검색어를 입력해 주세요.", null);
        }
        List<QnADTO> qnADTOs = qnAService.searchPosts(keyword);
        if (qnADTOs.isEmpty()) {
            return RsData.of("404", "검색 결과가 없습니다.", null);
        }
        return RsData.of("200", "검색 성공", new QnAsResponse(qnADTOs));
    }

    // 다건 조회
    @GetMapping("")
    public RsData<QnAsResponse> list() {
        List<QnADTO> qnADTOs = this.qnAService.getList();
        return RsData.of("200", "QnA 게시글 다건 조회 성공", new QnAsResponse(qnADTOs));
    }

    // 단건 조회
    @GetMapping("/{id}")
    public RsData<QnAResponse> getQnA(@PathVariable("id") Long id) {
        QnA qna = this.qnAService.getQnA(id);

        QnADTO qnADTO = new QnADTO(qna);
        return RsData.of("200", "QnA 게시글 단건 조회 성공", new QnAResponse(qnADTO));
    }

    // 본인이 작성한 게시글 조회
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/myqnas")
    public RsData<QnAsResponse> getMyQnAs(Principal principal) {

        String loggedInUser = principal.getName();

        List<QnADTO> myQnAs = qnAService.getQnAsByAuthor(loggedInUser);

        if (myQnAs.isEmpty()) {
            return RsData.of("404", "본인이 작성한 QnA 게시물이 없습니다.", null);
        }

        return RsData.of("200", "본인이 작성한 QnA 게시글 조회 성공", new QnAsResponse(myQnAs));
    }

    // QnA 게시글 생성
    @PreAuthorize("isAuthenticated()")
    @PostMapping("")
    public RsData<QnACreateResponse> create(@Valid @RequestBody QnACreateRequest qnACreateRequest,
                                            Principal principal) {
        String loggedInUser = principal.getName();
        if (loggedInUser == null) {
            return RsData.of("401", "로그인이 필요합니다.", null);
        }

        String htmlContent = markdownService.convertMarkdownToHtml(qnACreateRequest.getContent());
        QnA qna = qnAService.write(
                qnACreateRequest.getSubject(),
                htmlContent,
                loggedInUser
        );

        return RsData.of("200", "QnA 게시글 등록 성공", new QnACreateResponse(qna));
    }

    // QnA 게시글 수정
    @PreAuthorize("isAuthenticated()")
    @PatchMapping("/{id}")
    public RsData<QnAModifyResponse> modify(@PathVariable("id") Long id, @Valid @RequestBody QnAModifyRequest qnAModifyRequest,
                                            Principal principal) {
        QnA qna = this.qnAService.getQnA(id);

        String loggedInUser = principal.getName();
        if (!qna.getAuthor().getEmail().equals(loggedInUser)) {
            return RsData.of("403", "본인만 QnA 게시글을 수정할 수 있습니다.", null);
        }

        String htmlContent = markdownService.convertMarkdownToHtml(qnAModifyRequest.getContent());

        qna = this.qnAService.update(qna, htmlContent, qnAModifyRequest.getSubject(), loggedInUser);

        return RsData.of("200", "QnA 게시글 수정 성공", new QnAModifyResponse(qna));
    }

    // QnA 게시글 삭제
    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/{id}")
    public RsData<QnAResponse> delete(@PathVariable("id") Long id, Principal principal) {
        QnA qna = this.qnAService.getQnA(id);

        String loggedInUser = principal.getName();
        if (!qna.getAuthor().getEmail().equals(loggedInUser)) {
            return RsData.of("403", "본인만 QnA 게시글을 삭제할 수 있습니다.", null);
        }

        this.qnAService.delete(qna);
        QnADTO qnADTO = new QnADTO(qna);
        return RsData.of("200", "%d 번 QnA 게시물 삭제 성공".formatted(id), new QnAResponse(qnADTO));
    }

}
