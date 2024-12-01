package com.example.Main.domain.QnA.controller;

import com.example.Main.domain.Member.entity.Member;
import com.example.Main.domain.Member.service.MemberService;
import com.example.Main.domain.QnA.dto.QnADTO;
import com.example.Main.domain.QnA.dto.request.QnACreateRequest;
import com.example.Main.domain.QnA.dto.request.QnALikeDTO;
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

        if (qna == null || qna.getIsDraft())
            return RsData.of("500", "%d 번 QnA 게시물은 존재하지 않거나 임시 저장된 게시물입니다.".formatted(id), null);

        QnADTO qnADTO = new QnADTO(qna);
        return RsData.of("200", "QnA 게시글 단건 조회 성공", new QnAResponse(qnADTO));
    }

    // 본인이 작성한 게시글 조회
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/myqnas")
    public RsData<QnAsResponse> getMyQnAs(Principal principal) {
        if (principal == null) {
            return RsData.of("401", "로그인 후 사용 가능합니다.", null);
        }
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
        if (principal == null) {
            return RsData.of("401", "로그인 후 사용 가능합니다.", null);
        }
        String loggedInUser = principal.getName();

        String htmlContent = markdownService.convertMarkdownToHtml(qnACreateRequest.getContent());
        QnA qna = qnAService.write(
                qnACreateRequest.getSubject(),
                htmlContent,
                loggedInUser,
                qnACreateRequest.getIsDraft()
        );

        return RsData.of("200", "QnA 게시글 등록 성공", new QnACreateResponse(qna));
    }

    // QnA 게시글 수정
    @PreAuthorize("isAuthenticated()")
    @PatchMapping("/{id}")
    public RsData<QnAModifyResponse> modify(@PathVariable("id") Long id, @Valid @RequestBody QnAModifyRequest qnAModifyRequest,
                                            Principal principal) {
        if (principal == null) {
            return RsData.of("401", "로그인 후 사용 가능합니다.", null);
        }
        QnA qna = this.qnAService.getQnA(id);

        if (qna == null || qna.getIsDraft()) {
            return RsData.of("500", "%d 번 QnA 게시물은 존재하지 않거나 임시 저장된 게시물입니다.".formatted(id), null);
        }
        String loggedInUser = principal.getName();
        if (!qna.getAuthor().getEmail().equals(loggedInUser)) {
            return RsData.of("403", "본인만 QnA 게시글을 수정할 수 있습니다.", null);
        }

        String htmlContent = markdownService.convertMarkdownToHtml(qnAModifyRequest.getContent());

        qna = this.qnAService.update(qna, htmlContent, qnAModifyRequest.getSubject(), loggedInUser, qnAModifyRequest.getIsDraft());

        return RsData.of("200", "QnA 게시글 수정 성공", new QnAModifyResponse(qna));
    }

    // QnA 게시글 삭제
    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/{id}")
    public RsData<QnAResponse> delete(@PathVariable("id") Long id, Principal principal) {
        if (principal == null) {
            return RsData.of("401", "로그인 후 사용 가능합니다.", null);
        }
        QnA qna = this.qnAService.getQnA(id);

        if (qna == null || qna.getIsDraft()) {
            return RsData.of("500", "%d 번 QnA 게시물은 존재하지 않거나 임시 저장된 게시물입니다.".formatted(id), null);
        }
        String loggedInUser = principal.getName();
        if (!qna.getAuthor().getEmail().equals(loggedInUser)) {
            return RsData.of("403", "본인만 QnA 게시글을 삭제할 수 있습니다.", null);
        }

        this.qnAService.delete(qna);
        QnADTO qnADTO = new QnADTO(qna);
        return RsData.of("200", "%d 번 QnA 게시물 삭제 성공".formatted(id), new QnAResponse(qnADTO));
    }

    // 임시 저장된 QnA 게시물 목록 전체 조회
    @GetMapping("/draftsAll")
    public RsData<QnAsResponse> getDrafts() {
        List<QnADTO> draftQnAs = this.qnAService.getDrafts();

        if (draftQnAs.isEmpty()) {
            return RsData.of("404", "임시 저장된 QnA 게시물이 없습니다.", null);
        }

        return RsData.of("200", "임시 저장된 QnA 게시글 목록 조회 성공", new QnAsResponse(draftQnAs));
    }

    // 임시 저장된 QnA 게시물 목록 조회
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/drafts")
    public RsData<QnAsResponse> getDrafts(Principal principal) {
        if (principal == null) {
            return RsData.of("401", "로그인 후 사용 가능합니다.", null);
        }

        String loggedInUser = principal.getName();
        List<QnADTO> draftQnAs = this.qnAService.getDraftsByAuthor(loggedInUser);

        if (draftQnAs.isEmpty()) {
            return RsData.of("404", "임시 저장된 QnA 게시물이 없습니다.", null);
        }

        return RsData.of("200", "임시 저장된 QnA 게시글 목록 조회 성공", new QnAsResponse(draftQnAs));
    }

    // 임시 저장된 QnA 게시글 이어서 수정 작성
    @PreAuthorize("isAuthenticated()")
    @PatchMapping("/draft/{id}")
    public RsData<QnAModifyResponse> continueDraft(@PathVariable("id") Long id, @Valid @RequestBody QnAModifyRequest qnAModifyRequest,
                                                   Principal principal) {
        if (principal == null) {
            return RsData.of("401", "로그인 후 사용 가능합니다.", null);
        }

        QnA qna = this.qnAService.getQnA(id);

        if (qna == null || !qna.getIsDraft()) {
            return RsData.of("404", "%d 번 임시 저장 QnA 게시물이 존재하지 않거나, 삭제되었습니다.".formatted(id), null);
        }

        String loggedInUser = principal.getName();
        if (!qna.getAuthor().getEmail().equals(loggedInUser)) {
            return RsData.of("403", "본인만 임시 저장 QnA 게시글을 이어서 작성할 수 있습니다.", null);
        }

        String htmlContent = markdownService.convertMarkdownToHtml(qnAModifyRequest.getContent());

        qna = this.qnAService.continueDraft(
                id,
                htmlContent,
                qnAModifyRequest.getSubject(),
                loggedInUser,
                qnAModifyRequest.getIsDraft()
        );

        return RsData.of("200", "임시 저장된 QnA 게시글 이어서 작성 성공", new QnAModifyResponse(qna));
    }

    // 임시 저장된 QnA 게시물 삭제
    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/draft/{id}")
    public RsData<QnAResponse> deleteDraft(@PathVariable("id") Long id, Principal principal) {
        if (principal == null) {
            return RsData.of("401", "로그인 후 사용 가능합니다.", null);
        }

        QnA qna = this.qnAService.getQnA(id);

        if (qna == null || !qna.getIsDraft()) {
            return RsData.of("404", "%d 번 임시 저장 QnA 게시물이 존재하지 않습니다.".formatted(id), null);
        }

        String loggedInUser = principal.getName();
        if (!qna.getAuthor().getEmail().equals(loggedInUser)) {
            return RsData.of("403", "본인만 임시 저장 QnA 게시물을 삭제할 수 있습니다.", null);
        }

        this.qnAService.deleteDraft(id);
        return RsData.of("200", "%d 번 임시 저장 QnA 게시물 삭제 성공".formatted(id), null);
    }

    // 좋아요
    @PreAuthorize("isAuthenticated()")
    @PostMapping("/{id}/like")
    public RsData<QnAResponse> like(@PathVariable("id") Long id,
                                    @RequestBody QnALikeDTO qnALikeDTO,
                                    Principal principal) {
        if (principal == null) {
            return RsData.of("401", "로그인 후 사용 가능합니다.", null);
        }
        String loggedInUser = principal.getName();

        QnA qna = this.qnAService.getQnA(id);

        if (qna == null || qna.getIsDraft()) {
            return RsData.of("500", "%d 번 QnA 게시물은 존재하지 않거나 임시 저장된 게시물입니다.".formatted(id), null);
        }

        Member member = memberService.getMemberByEmail(loggedInUser);
        boolean isLiked = qna.getLikedByMembers().contains(member);

        if (isLiked) {
            this.qnAService.unlikePost(id, loggedInUser);
            return RsData.of("200", "%d 번 QnA 게시물의 좋아요가 취소되었습니다.".formatted(id), new QnAResponse(new QnADTO(qna)));
        } else {
            this.qnAService.likePost(id, loggedInUser);
            return RsData.of("200", "%d 번 QnA 게시물에 좋아요 성공".formatted(id), new QnAResponse(new QnADTO(qna)));
        }
    }
}
