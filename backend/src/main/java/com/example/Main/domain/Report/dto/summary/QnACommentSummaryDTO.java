package com.example.Main.domain.Report.dto.summary;

import com.example.Main.domain.QnA.Comment.entity.QnAComment;
import lombok.Getter;

@Getter
public class QnACommentSummaryDTO {

    private final Long commentId;
    private final String authorName;
    private final String content;

    public QnACommentSummaryDTO(QnAComment qnAComment) {
        this.commentId = qnAComment.getId();
        this.authorName = qnAComment.getAuthor() != null ? qnAComment.getAuthor().getName() : "Unknown";
        this.content = qnAComment.getContent();
    }
}
