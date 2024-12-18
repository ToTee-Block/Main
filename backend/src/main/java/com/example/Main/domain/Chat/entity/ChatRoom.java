package com.example.Main.domain.Chat.entity;

import com.example.Main.global.Jpa.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Getter
@Setter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class ChatRoom extends BaseEntity {
    @Column(nullable = false, unique = true)
    private String name;  //채팅방 이름

    @OneToMany(mappedBy = "chatRoom")
    private List<ChatJoin> chatJoiners;
}
