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
    private String senderName;
    private String senderProfile; // 발신자 프로필 이미지 추가
    private String type;     // 메시지 타입 (sent 또는 received)
    private String contentType;   // image 또는 text


    public ChatDTO(Long roomId, Long senderId, String message, LocalDateTime sendTime, String senderName, String senderProfile, String type,String contentType) {
        this.roomId = roomId;
        this.senderId = senderId;
        this.message = message;
        this.sendTime = sendTime;
        this.senderName = senderName;
        this.senderProfile = senderProfile; // 프로필 이미지 추가
        this.type = type;// 타입도 생성자에서 설정
        this.contentType = contentType;
    }
}

