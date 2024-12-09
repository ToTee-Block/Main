package com.example.Main.domain.Chat.repository;

import com.example.Main.domain.Chat.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
}
