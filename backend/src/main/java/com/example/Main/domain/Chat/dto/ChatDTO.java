package com.example.Main.domain.Chat.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
public class ChatDTO {

    @JsonProperty("roomId")
    private  Long id;
    private  String name;
    private  String message;
    private  LocalDateTime sendTime;

    public ChatDTO(Long id, String name, String message, LocalDateTime sendTime){
        this.id= id;
        this.name= name;
        this.message = message;
        this.sendTime=  sendTime;
    }
}
