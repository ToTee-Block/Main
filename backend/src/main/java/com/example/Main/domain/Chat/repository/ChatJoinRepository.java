package com.example.Main.domain.Chat.repository;

import com.example.Main.domain.Chat.entity.ChatJoin;
import com.example.Main.domain.Chat.entity.ChatRoom;
import com.example.Main.domain.Member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ChatJoinRepository extends JpaRepository<ChatJoin, Long> {
    List<ChatJoin> findByChatJoiner(Member chatJoiner);
    List<ChatJoin> findByChatRoom(ChatRoom chatRoom);
    Optional<ChatJoin> findByChatJoinerAndChatRoom(Member chatJoiner, ChatRoom chatRoom);
}
