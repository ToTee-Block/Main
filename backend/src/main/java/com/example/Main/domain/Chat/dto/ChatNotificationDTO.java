package com.example.Main.domain.Chat.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class ChatNotificationDTO {

    private Long roomId;         // 채팅방 ID
    private String senderEmail;   // 발신자 이름
    private String message;      // 메시지 내용
    private String type;         // 알림 타입 (예: "text", "image")
    private LocalDateTime timestamp; // 알림 발생 시간
    //TODO : unreadCount 추가

    public ChatNotificationDTO(Long roomId, String senderEmail, String message, String type, LocalDateTime timestamp) {
        this.roomId = roomId;
        this.senderEmail = senderEmail;
        this.message = message;
        this.type = type;
        this.timestamp = timestamp;
    }
}
