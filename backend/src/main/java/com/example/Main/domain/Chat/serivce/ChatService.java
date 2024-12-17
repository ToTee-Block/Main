package com.example.Main.domain.Chat.serivce;

import com.example.Main.domain.Chat.dto.ChatDTO;
import com.example.Main.domain.Chat.entity.ChatJoin;
import com.example.Main.domain.Chat.entity.ChatMessage;
import com.example.Main.domain.Chat.entity.ChatRoom;
import com.example.Main.domain.Chat.repository.ChatJoinRepository;
import com.example.Main.domain.Chat.repository.ChatMessageRepository;
import com.example.Main.domain.Chat.repository.ChatRoomRepository;
import com.example.Main.domain.Member.entity.Member;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatService {
    private final ChatRoomRepository chatRoomRepository;
    private final ChatJoinRepository chatJoinRepository;
    private final ChatMessageRepository chatMessageRepository;

    // 메시지 저장
    public void saveMessage(ChatDTO chatDTO) {
        ChatMessage chatMessage = toEntity(chatDTO);
        chatMessageRepository.save(chatMessage);
    }

    // 채팅방 ID로 메시지 가져오기
    public List<ChatMessage> getMessagesByRoomId(Long roomId) {
        if (roomId == null) {
            throw new IllegalArgumentException("Room ID cannot be null");
        }
        return chatMessageRepository.findMessagesByChatRoomId(roomId);
    }

    // ChatDTO -> Chat 엔티티 변환
    private ChatMessage toEntity(ChatDTO chatDTO) {
        ChatJoin chatJoin = this.chatJoinRepository.findByMemberIdAndRoomId(
                chatDTO.getSenderId(), // ChatDTO에서 senderId를 가져옴
                chatDTO.getRoomId()    // ChatDTO에서 roomId를 가져옴
        ).orElseThrow(() -> new IllegalArgumentException("User not joined chat room"));
        return ChatMessage.builder()
                .chatSender(chatJoin)
                .message(chatDTO.getMessage())
                .build();
    }

    // Chat 엔티티 -> ChatDTO 변환
    public ChatDTO toDTO(ChatMessage message) {
        return new ChatDTO(
                message.getChatSender().getChatRoom().getId(),
                message.getChatSender().getChatJoiner().getId(),
                message.getMessage(),
                message.getCreatedDate(),
                message.getChatSender().getChatJoiner().getName(),
                null,
                ""
        );
    }

    // 모든 채팅방 가져오기 -> 한 유저가 들어간 채팅방 가져오기
    public List<ChatJoin> getAllRooms(Member chatJoiner) {
        return this.chatJoinRepository.findByChatJoiner(chatJoiner);
    }

    public ChatRoom createRoom(String name) {
        ChatRoom newRoom = ChatRoom.builder()
                .name(name).build();
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

    public boolean isJoiner(Long memberId, Long roomId) {
        return this.chatJoinRepository.findByMemberIdAndRoomId(memberId, roomId).isPresent();
    }
}
