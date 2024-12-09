package com.example.Main.domain.Chat.entity;

import com.example.Main.domain.Member.entity.Member;
import com.example.Main.global.Jpa.BaseEntity;
import jakarta.persistence.*;
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
@Table(
        name = "chat_join",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"member_id", "chat_room_id"})
        }
)
public class ChatJoin extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member chatJoiner;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chat_room_id")
    private ChatRoom chatRoom;

    @OneToMany(mappedBy = "chatSender")
    private List<ChatMessage> chatMessages;
}
