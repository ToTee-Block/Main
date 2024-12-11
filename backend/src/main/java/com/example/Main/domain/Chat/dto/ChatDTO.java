package com.example.Main.domain.Chat.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class ChatDTO {

    @JsonProperty("roomId")
    private Long roomId;     // 채팅방 ID
    private Long senderId;   // 작성자 ID
    private String message;  // 메시지 내용
    private LocalDateTime sendTime;

    public ChatDTO(Long roomId, Long senderId, String message, LocalDateTime sendTime) {
        this.roomId = roomId;
        this.senderId = senderId;
        this.message = message;
        this.sendTime = sendTime;
    }
}
