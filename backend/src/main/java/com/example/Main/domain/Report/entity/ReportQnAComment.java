package com.example.Main.domain.Report.entity;

import com.example.Main.domain.Member.entity.Member;
import com.example.Main.domain.QnA.Comment.entity.QnAComment;
import com.example.Main.domain.Report.enums.ReportReason;
import com.example.Main.domain.Report.enums.ReportStatus;
import com.example.Main.global.Jpa.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString(callSuper = true)
public class ReportQnAComment extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "comment_id")
    private QnAComment qnAComment;

    @ManyToOne
    @JoinColumn(name = "member_id")
    private Member reporter;

    @Enumerated(EnumType.STRING)
    @NotNull
    private ReportReason reason;

    @Enumerated(EnumType.STRING)
    private ReportStatus status = ReportStatus.PENDING;
}
