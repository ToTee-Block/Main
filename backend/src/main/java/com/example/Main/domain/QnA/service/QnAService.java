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
    public QnA write(String subject, String content, String userEmail) {
        Member member = memberService.getMemberByEmail(userEmail);

        QnA qnA = QnA.builder()
                .subject(subject)
                .content(content)
                .author(member)
                .build();
        this.qnARepository.save(qnA);
        return qnA;
    }

    // 수정
    public QnA update(QnA qnA, String content, String subject, String userEmail) {
        Member member = memberService.getMemberByEmail(userEmail);
        qnA.setSubject(subject);
        qnA.setContent(content);
        qnA.setAuthor(member);
        this.qnARepository.save(qnA);
        return qnA;
    }

    // 삭제
    public void delete(QnA qnA) {
        this.qnARepository.delete(qnA);
    }

}
