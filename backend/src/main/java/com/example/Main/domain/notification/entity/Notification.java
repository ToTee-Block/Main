package com.example.Main.domain.notification.entity;

import com.example.Main.domain.Member.entity.Member;
import com.example.Main.global.Jpa.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Getter
@Setter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Notification extends BaseEntity {
    @ManyToOne
    private Member member;

    private String message;

    @Column(nullable = false)
    private boolean read = false;


    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // 생성자 추가
    public Notification(Member member, String message) {
        this.member = member;
        this.message = message;
        this.read = false;
    }
}

