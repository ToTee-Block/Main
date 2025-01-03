package com.example.Main.domain.Chat.repository;

import com.example.Main.domain.Chat.entity.ChatJoin;
import com.example.Main.domain.Chat.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    @Query("SELECT cm FROM ChatMessage cm WHERE cm.chatSender.chatRoom.id = :chatRoomId")
    List<ChatMessage> findMessagesByChatRoomId(@Param("chatRoomId") Long chatRoomId);
    void deleteByChatSender(ChatJoin chatSender);
}
