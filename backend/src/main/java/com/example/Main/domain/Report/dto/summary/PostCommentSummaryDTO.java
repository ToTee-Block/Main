package com.example.Main.domain.Report.dto.summary;

import com.example.Main.domain.Post.Comment.entity.PostComment;
import lombok.Getter;

@Getter
public class PostCommentSummaryDTO {

    private final Long commentId;
    private final String authorName;
    private final String content;

    public PostCommentSummaryDTO(PostComment
                                         postComment) {
        this.commentId = postComment.getId();
        this.authorName = postComment.getAuthor() != null ? postComment.getAuthor().getName() : "Unknown";
        this.content = postComment.getContent();
    }
}
