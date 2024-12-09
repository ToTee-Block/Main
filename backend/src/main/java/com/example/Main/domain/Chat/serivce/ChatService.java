package com.example.Main.domain.Chat.serivce;

import com.example.Main.domain.Chat.dto.ChatDTO;
import com.example.Main.domain.Chat.entity.Chat;
import com.example.Main.domain.Chat.entity.ChatRoom;
import com.example.Main.domain.Chat.repository.ChatRepository;
import com.example.Main.domain.Chat.repository.ChatRoomRepository;
import com.example.Main.domain.Member.entity.Member;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
@Service
@RequiredArgsConstructor
public class ChatService {
    private final ChatRepository chatRepository;
    private  final ChatRoomRepository chatRoomRepository;

    // 메시지 저장
    public void saveMessage(ChatDTO chatDTO, Member member) {
        Chat chat = toEntity(chatDTO, member);
        chatRepository.save(chat);
    }

    // 채팅방 ID로 메시지 가져오기
    public List<Chat> getMessagesByRoomId(Long roomId) {
        if (roomId == null) {
            throw new IllegalArgumentException("Room ID cannot be null");
        }
        return chatRepository.findByChatRoomId(roomId);
    }

    // ChatDTO -> Chat 엔티티 변환
    private Chat toEntity(ChatDTO chatDTO, Member member) {
        return new Chat(
                chatDTO.getId(),
                member.getName(),
                chatDTO.getMessage(),
                LocalDateTime.now()
        );
    }

    // Chat 엔티티 -> ChatDTO 변환
    public ChatDTO toDTO(Chat chat) {
        return new ChatDTO(
                chat.getChatRoomId(),
                chat.getSenderName(),
                chat.getMessage(),
                chat.getSendTime()
        );
    }

    // 모든 채팅방 가져오기
    public List<ChatRoom> getAllRooms(){
        return chatRoomRepository.findAll();
    }
    public ChatRoom createRoom(String name) {
        ChatRoom newRoom = new ChatRoom(name);
        return chatRoomRepository.save(newRoom);
    }

    public void deleteRoom(Long roomId) {
        if (!chatRoomRepository.existsById(roomId)) {
            throw new IllegalArgumentException("Invalid room ID");
        }
        chatRoomRepository.deleteById(roomId);
    }

    public ChatRoom getRoomDetails(Long roomId) {
        return chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("Room not found"));
    }

    // ChatService 클래스에 추가
    public boolean deleteMessageById(Long messageId) {
        try {
            if (!chatRepository.existsById(messageId)) {
                System.err.println("Message ID not found: " + messageId);
                return false;
            }

            chatRepository.deleteById(messageId);
            System.out.println("Message deleted from repository: " + messageId);
            return true;
        } catch (Exception e) {
            System.err.println("Error deleting message from repository: " + e.getMessage());
            return false;
        }
    }

    public Chat saveMessages(ChatDTO chatDTO, Member member) {
        Chat chat = toEntity(chatDTO, member);
        return chatRepository.save(chat);
    }





}
