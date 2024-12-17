package com.example.Main.domain.Report.entity;

import com.example.Main.domain.Member.entity.Member;
import com.example.Main.domain.Post.entity.Post;
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
public class Report extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "post_id")
    private Post post;

    @ManyToOne
    @JoinColumn(name = "member_id")
    private Member reporter;

    @Enumerated(EnumType.STRING)
    @NotNull
    private ReportReason reason;

    @Enumerated(EnumType.STRING)
    private ReportStatus status = ReportStatus.PENDING;
}
