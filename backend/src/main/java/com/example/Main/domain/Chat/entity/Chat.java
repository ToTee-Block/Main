package com.example.Main.domain.Chat.entity;

import com.example.Main.global.Jpa.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Getter
@Setter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Chat extends BaseEntity {
    @Column(nullable = false)
    private Long chatRoomId;  // 채팅방 ID

    @Column(nullable = false)
    private String senderName;  // 발신자 이름

    @Column(nullable = false)
    private String message;  // 메시지 내용

    @Column(nullable = false)
    private LocalDateTime sendTime;  // 전송 시간
}