package com.example.Main.domain.Chat.entity;

import com.example.Main.global.Jpa.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
    private String senderName;  // 발신자 이름

    @Column(nullable = false)
    private String message;  // 메시지 내용

    @ManyToOne
    @JoinColumn(name = "chat_join_id")
    private ChatJoin chatSender;
}
