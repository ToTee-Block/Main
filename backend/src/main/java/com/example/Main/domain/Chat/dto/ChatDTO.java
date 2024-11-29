package com.example.Main.domain.Chat.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
public class ChatDTO {

    private  Long id;
    private  String name;
    private  String message;
    private  LocalDateTime senTime;

    public ChatDTO(Long id, String name, String message, LocalDateTime senTime){
        this.id= id;
        this.name= name;
        this.message = message;
        this.senTime=  senTime;
    }
}
