package com.example.Main.domain.Report.dto.summary;

import com.example.Main.domain.Post.entity.Post;
import com.example.Main.domain.QnA.entity.QnA;
import lombok.Getter;

@Getter
public class SummaryDTO {

    private final Long targetId;
    private final String url;
    private final String authorName;
    private final String subject;

    public SummaryDTO(Object target) {
        if (target instanceof Post) {
            Post post = (Post) target;
            this.targetId = post.getId();
            this.url = "post";
            this.authorName = post.getAuthor() != null ? post.getAuthor().getName() : "Unknown";
            this.subject = post.getSubject();
        } else if (target instanceof QnA) {
            QnA qnA = (QnA) target;
            this.targetId = qnA.getId();
            this.url = "qna";
            this.authorName = qnA.getAuthor() != null ? qnA.getAuthor().getName() : "Unknown";
            this.subject = qnA.getSubject();
        } else {
            throw new IllegalArgumentException("Unsupported target type");
        }
    }
}
