package com.example.Main.domain.Report.dto;

import com.example.Main.domain.QnA.entity.QnA;
import lombok.Getter;

@Getter
public class QnASummaryDTO {

    private final Long qnAId;
    private final String postUrl;
    private final String authorName;
    private final String subject;

    public QnASummaryDTO(QnA qnA) {
        this.qnAId = qnA.getId();
        this.postUrl = qnA.getId() != null ? "http://localhost:8081/api/v1/qna/" + qnA.getId() : "";
        this.authorName = qnA.getAuthor() != null ? qnA.getAuthor().getName() : "Unknown";
        this.subject = qnA.getSubject();
    }
}
