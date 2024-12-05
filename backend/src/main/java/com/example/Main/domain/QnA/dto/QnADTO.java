package com.example.Main.domain.QnA.dto;

import com.example.Main.domain.Member.entity.Member;
import com.example.Main.domain.QnA.entity.QnA;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Getter
public class QnADTO {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private final Long id;

    private final String subject;

    private String content;

    private final String authorEmail;

    private final LocalDateTime createdDate;

    @LastModifiedDate
    private final LocalDateTime modifiedDate;

    private final Boolean isDraft;

    private final int likes;

    private final List<String> likedByEmails;

    public QnADTO(QnA qna) {
        this.id = qna.getId();
        this.subject = qna.getSubject();
        this.content = qna.getContent();
        this.authorEmail = qna.getAuthor().getEmail();
        this.isDraft = qna.getIsDraft();
        this.createdDate= qna.getCreatedDate();
        this.modifiedDate=qna.getModifiedDate();
        this.likes = qna.getLikes();
        Set<Member> likedByMembersSet = qna.getLikedByMembers() != null ? qna.getLikedByMembers() : Set.of();
        this.likedByEmails = likedByMembersSet.stream()
                .map(member -> member.getEmail())
                .collect(Collectors.toList());
    }

    public void setContent(String content){
        this.content=content;
    }
}
