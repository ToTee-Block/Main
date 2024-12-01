package com.example.Main.domain.QnA.service;

import com.example.Main.domain.Member.entity.Member;
import com.example.Main.domain.Member.repository.MemberRepository;
import com.example.Main.domain.Member.service.MemberService;
import com.example.Main.domain.QnA.dto.QnADTO;
import com.example.Main.domain.QnA.entity.QnA;
import com.example.Main.domain.QnA.repository.QnARepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QnAService {
    private final QnARepository qnARepository;
    private final MemberRepository memberRepository;
    private final MemberService memberService;

    // 검색 기능
    public List<QnADTO> searchPosts(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            List<QnA> qnAList = qnARepository.findAllByIsDraftFalse(Sort.by(Sort.Order.desc("createdDate")));
            return qnAList.stream()
                    .map(QnADTO::new)
                    .collect(Collectors.toList());
        }
        List<QnA> qnAList = qnARepository.searchByKeyword(keyword, Sort.by(Sort.Order.desc("createdDate")));
        return qnAList.stream()
                .map(QnADTO::new)
                .collect(Collectors.toList());
    }

    // QnA 게시글 전체 조회
    public List<QnADTO> getList() {
        List<QnA> qnAList = this.qnARepository.findAllByIsDraftFalse(Sort.by(Sort.Order.desc("createdDate")));

        List<QnADTO> qnADTOList = qnAList.stream()
                .map(qnA -> new QnADTO(qnA))
                .collect(Collectors.toList());
        return qnADTOList;
    }

    // QnA 게시글 단건 조회
    public QnA getQnA(Long id) {
        Optional<QnA> optionalQnA = this.qnARepository.findById(id);
        return optionalQnA.orElse(null);
    }

    // 본인이 작성한 QnA 게시글 조회
    public List<QnADTO> getQnAsByAuthor(String authorEmail) {
        List<QnA> qnAsByAuthor = qnARepository.findByAuthor_EmailAndIsDraftFalse(authorEmail, Sort.by(Sort.Order.desc("createdDate")));
        return qnAsByAuthor.stream()
                .map(QnADTO::new)
                .collect(Collectors.toList());
    }

    // 작성
    public QnA write(String subject, String content, String userEmail, boolean isDraft) {
        Member member = memberService.getMemberByEmail(userEmail);

        QnA qnA = QnA.builder()
                .subject(subject)
                .content(content)
                .author(member)
                .isDraft(isDraft)
                .build();
        this.qnARepository.save(qnA);
        return qnA;
    }

    // 수정
    public QnA update(QnA qnA, String content, String subject, String userEmail, boolean isDraft) {
        Member member = memberService.getMemberByEmail(userEmail);
        qnA.setSubject(subject);
        qnA.setContent(content);
        qnA.setAuthor(member);
        qnA.setIsDraft(isDraft);
        this.qnARepository.save(qnA);
        return qnA;
    }

    // 삭제
    public void delete(QnA qnA) {
        this.qnARepository.delete(qnA);
    }

    // 임시 저장된 QnA 게시글 목록 조회
    public List<QnADTO> getDrafts() {
        List<QnA> draftQnAs = qnARepository.findByIsDraftTrue(Sort.by(Sort.Order.desc("createdDate")));
        return draftQnAs.stream()
                .map(QnADTO::new)
                .collect(Collectors.toList());
    }

    // 임시 저장된 QnA 게시글 이어서 작성
    public QnA continueDraft(Long qnAId, String content, String subject, String userEmail, boolean isDraft) {
        QnA qnA = this.getQnA(qnAId);

        if (qnA == null || !qnA.getIsDraft()) {
            throw new IllegalArgumentException("임시 저장된 QnA 게시글이 존재하지 않거나, 삭제된 게시글입니다.");
        }

        Member member = memberService.getMemberByEmail(userEmail);
        qnA.setContent(content);
        qnA.setSubject(subject);
        qnA.setAuthor(member);
        qnA.setIsDraft(isDraft);
        this.qnARepository.save(qnA);
        return qnA;
    }

    // 본인이 임시 저장한 QnA 게시글 조회
    public List<QnADTO> getDraftsByAuthor(String authorEmail) {
        List<QnA> draftQnAs = qnARepository.findByAuthor_EmailAndIsDraftTrue(authorEmail, Sort.by(Sort.Order.desc("createdDate")));
        return draftQnAs.stream()
                .map(QnADTO::new)
                .collect(Collectors.toList());
    }

    // 임시 저장된 QnA 게시물 삭제
    public void deleteDraft(Long id) {
        Optional<QnA> optionalQnA = this.qnARepository.findById(id);
        if (optionalQnA.isPresent()) {
            QnA qnA = optionalQnA.get();
            if (qnA.getIsDraft()) {
                this.qnARepository.delete(qnA);
            }
        }
    }

    // 좋아요 추가
    public void likePost(Long qnAId, String memberEmail) {
        QnA qnA = qnARepository.findById(qnAId).orElseThrow(() -> new IllegalArgumentException("QnA 게시물을 찾을 수 없습니다."));
        Member member = memberRepository.findByEmail(memberEmail).orElseThrow(() -> new IllegalArgumentException("회원이 존재하지 않습니다."));

        // 좋아요 추가
        qnA.addLike(member);
        qnARepository.save(qnA);
    }

    // 좋아요 취소
    public void unlikePost(Long qnAId, String memberEmail) {
        QnA qnA = qnARepository.findById(qnAId).orElseThrow(() -> new IllegalArgumentException("QnA 게시물을 찾을 수 없습니다."));
        Member member = memberRepository.findByEmail(memberEmail).orElseThrow(() -> new IllegalArgumentException("회원이 존재하지 않습니다."));

        qnA.removeLike(member);
        qnARepository.save(qnA);
    }
}
