package com.example.Main.domain.Chat.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
public class ChatRoom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false,unique = true)
    private  String name;  //채팅방 이름

    public ChatRoom(String name){
        this.name=name;

    }

    @CreationTimestamp
    @Column(updatable = false , nullable = false)
    private LocalDateTime createdAt;
}
