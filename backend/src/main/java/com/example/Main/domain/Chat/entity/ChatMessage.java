package com.example.Main.domain.Chat.entity;

import com.example.Main.global.Jpa.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@Getter
@Setter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class ChatMessage extends BaseEntity {
    @Column(nullable = false)
    private String message;  // 메시지 내용

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chat_join_id", nullable = false)
    private ChatJoin chatSender;
}
