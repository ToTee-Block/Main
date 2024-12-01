package com.example.Main.domain.QnA.entity;

import com.example.Main.domain.Member.entity.Member;
import com.example.Main.global.Jpa.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@ToString(callSuper = true)
public class QnA extends BaseEntity {

    private String subject;
    private String content;

    @ManyToOne
    private Member author;

    @Column(name = "is_draft")
    private Boolean isDraft;  // 임시 저장 여부
}
