package com.example.Main.domain.QnA.Comment.service;

import com.example.Main.domain.Member.entity.Member;
import com.example.Main.domain.Member.service.MemberService;
import com.example.Main.domain.Post.Comment.entity.PostComment;
import com.example.Main.domain.QnA.Comment.dto.QnACommentDTO;
import com.example.Main.domain.QnA.Comment.entity.QnAComment;
import com.example.Main.domain.QnA.Comment.repository.QnACommentRepository;
import com.example.Main.domain.QnA.entity.QnA;
import com.example.Main.domain.QnA.service.QnAService;
import com.example.Main.domain.Report.entity.ReportPostComment;
import com.example.Main.domain.Report.entity.ReportQnAComment;
import com.example.Main.domain.Report.repository.ReportPostCommentRepository;
import com.example.Main.domain.Report.repository.ReportQnACommentRepository;
import com.example.Main.global.ErrorMessages.ErrorMessages;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QnACommentService {

    private final QnACommentRepository commentRepository;
    private final QnAService qnAService;
    private final MemberService memberService;
    private final ReportQnACommentRepository reportQnACommentRepository;

    // 댓글 목록 조회
    public List<QnACommentDTO> getCommentsByQnAId(Long qnAId) {
        QnA qnA = qnAService.getQnA(qnAId);
        if (qnA == null) {
            throw new IllegalArgumentException(ErrorMessages.QNA_NOT_FOUND);
        }

        List<QnAComment> comments = commentRepository.findByQnA(qnA, Sort.by(Sort.Order.desc("createdDate")));
        return comments.stream()
                .filter(comment -> comment.getParentComment() == null)
                .map(QnACommentDTO::new)
                .collect(Collectors.toList());
    }

    // 댓글 및 대댓글 조회
    public List<QnACommentDTO> getRepliesByCommentId(Long commentId) {
        List<QnAComment> replies = commentRepository.findByParentCommentId(commentId, Sort.by(Sort.Order.desc("createdDate")));
        return replies.stream()
                .map(QnACommentDTO::new)
                .collect(Collectors.toList());
    }

    // 대댓글 조회
    public List<QnACommentDTO> getRepliesByParentCommentId(Long parentCommentId) {
        List<QnAComment> replies = commentRepository.findByParentCommentId(parentCommentId, Sort.by(Sort.Order.desc("createdDate")));
        return replies.stream()
                .map(QnACommentDTO::new)
                .collect(Collectors.toList());
    }

    // 댓글 단일 조회
    public Optional<QnAComment> getComment(Long commentId) {
        return commentRepository.findById(commentId);
    }

    // 본인이 작성한 댓글 조회
    public List<QnACommentDTO> getQnACommentsByUserAndQnAId(String email, Long qnAId) {
        List<QnAComment> comments = commentRepository.findByQnAIdAndAuthorEmail(qnAId, email);
        return comments.stream()
                .map(QnACommentDTO::new)
                .collect(Collectors.toList());
    }

    // 본인이 작성한 댓글 조회
    public List<QnACommentDTO> getRepliesByUserAndParentCommentId(String email, Long parentCommentId) {
        List<QnAComment> replies = commentRepository.findByParentCommentIdAndAuthorEmail(parentCommentId, email);
        return replies.stream()
                .map(QnACommentDTO::new)
                .collect(Collectors.toList());
    }

    // 댓글 작성
    public QnAComment addComment(Long qnAId, String userEmail, String content, Long parentCommentId) {

        Member author = memberService.getMemberByEmail(userEmail);
        if (author == null) {
            throw new IllegalArgumentException(ErrorMessages.UNAUTHORIZED);
        }

        QnA qnA = qnAService.getQnA(qnAId);
        if (qnA == null) {
            throw new IllegalArgumentException(ErrorMessages.QNA_NOT_FOUND);
        }

        QnAComment parentComment = null;
        if (parentCommentId != null) {
            parentComment = commentRepository.findById(parentCommentId).orElse(null);
            if (parentComment == null) {
                throw new IllegalArgumentException(ErrorMessages.REPLY_PARENT_COMMENT_NOT_FOUND);
            }
        }

        QnAComment newComment = new QnAComment();
        newComment.setContent(content);
        newComment.setAuthor(author);
        newComment.setQnA(qnA);
        newComment.setParentComment(parentComment);

        commentRepository.save(newComment);

        return newComment;
    }

    // 댓글 수정
    public QnAComment updateComment(Long commentId, String content, String userEmail) {
        Optional<QnAComment> commentOpt = commentRepository.findById(commentId);

        if (commentOpt.isEmpty()) {
            throw new IllegalArgumentException(ErrorMessages.COMMENT_NOT_FOUND);
        }

        QnAComment comment = commentOpt.get();

        if (!comment.getAuthor().getEmail().equals(userEmail)) {
            throw new IllegalArgumentException(ErrorMessages.FORBIDDEN);
        }

        comment.setContent(content);
        return commentRepository.save(comment);
    }

    // 댓글 삭제
    @Transactional
    public boolean deleteComment(Long commentId) {
        QnAComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException(ErrorMessages.COMMENT_NOT_FOUND));

        List<ReportQnAComment> reportQnAComments = comment.getReportQnAComments();
        reportQnACommentRepository.deleteAll(reportQnAComments);

        commentRepository.delete(comment);

        return true;
    }

    // 댓글 삭제 : 관리자
    @Transactional
    public boolean deleteCommentByAdmin(Long commentId) {
        QnAComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException(ErrorMessages.COMMENT_NOT_FOUND));

        List<ReportQnAComment> reportQnAComments = comment.getReportQnAComments();
        reportQnACommentRepository.deleteAll(reportQnAComments);

        commentRepository.delete(comment);

        return true;
    }


    public boolean hasReplies(QnAComment comment) {
        List<QnAComment> replies = commentRepository.findByParentCommentId(comment.getId(), Sort.by(Sort.Order.desc("createdDate")));

        if (!replies.isEmpty()) {
            return true;
        }

        // 자식 대댓글 트리까지 재귀적으로 확인
        for (QnAComment reply : replies) {
            if (hasReplies(reply)) {
                return true;
            }
        }

        return false;
    }


    // 댓글 좋아요 추가
    public boolean likeComment(Long commentId, String userEmail) {
        Optional<QnAComment> commentOpt = commentRepository.findById(commentId);

        if (commentOpt.isEmpty()) {
            throw new IllegalArgumentException(ErrorMessages.COMMENT_NOT_FOUND);
        }

        QnAComment comment = commentOpt.get();
        Member member = memberService.getMemberByEmail(userEmail);

        comment.addLike(member);
        commentRepository.save(comment);
        return true;
    }

    // 댓글 좋아요 취소
    public boolean unlikeComment(Long commentId, String userEmail) {
        Optional<QnAComment> commentOpt = commentRepository.findById(commentId);

        if (commentOpt.isEmpty()) {
            throw new IllegalArgumentException(ErrorMessages.COMMENT_NOT_FOUND);
        }

        QnAComment comment = commentOpt.get();
        Member member = memberService.getMemberByEmail(userEmail);

        comment.removeLike(member);
        commentRepository.save(comment);
        return true;
    }
}
