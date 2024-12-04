package com.example.Main.domain.Chat.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
public class Chat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long chatRoomId;  // 채팅방 ID

    @Column(nullable = false)
    private String senderName;  // 발신자 이름

    @Column(nullable = false)
    private String message;  // 메시지 내용

    @Column(nullable = false)
    private LocalDateTime sendTime;  // 전송 시간

    public Chat(Long chatRoomId, String senderName, String message, LocalDateTime sendTime) {
        this.chatRoomId = chatRoomId;
        this.senderName = senderName;
        this.message = message;
        this.sendTime = sendTime;
    }
}