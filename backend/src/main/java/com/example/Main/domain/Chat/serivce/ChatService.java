package com.example.Main.domain.Chat.serivce;

import com.example.Main.domain.Chat.dto.ChatDTO;
import com.example.Main.domain.Chat.entity.ChatJoin;
import com.example.Main.domain.Chat.entity.ChatMessage;
import com.example.Main.domain.Chat.entity.ChatRoom;
import com.example.Main.domain.Chat.repository.ChatJoinRepository;
import com.example.Main.domain.Chat.repository.ChatMessageRepository;
import com.example.Main.domain.Chat.repository.ChatRoomRepository;
import com.example.Main.domain.Member.entity.Member;
import com.example.Main.domain.Member.repository.MemberRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.File;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
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
        // contentType을 설정: 이미지 URL 여부를 확인
        String contentType = message.getMessage().startsWith("/uploads/") ? "image" : "text";

        return new ChatDTO(
                message.getChatSender().getChatRoom().getId(),       // 채팅방 ID
                message.getChatSender().getChatJoiner().getId(),     // 발신자 ID
                message.getMessage(),                                // 메시지 내용 (텍스트 또는 이미지 URL)
                message.getCreatedDate(),                            // 전송 시간
                message.getChatSender().getChatJoiner().getName(),   // 발신자 이름
                null,                                               // senderProfile (추후 추가할 경우 수정)
                "",                                                 // 메시지 타입 (sent 또는 received, 필요 시 설정)
                contentType                                          // 콘텐츠 타입: image 또는 text
        );
    }
    public String saveImage(MultipartFile imageFile) {
        try {
            // 저장 경로 설정 (resources/static/uploads/)
            String uploadDir = "C:/Users/LENOVO/Desktop/project/uploads/";
            File directory = new File(uploadDir);
            if (!directory.exists()) {
                directory.mkdirs(); // 디렉토리가 존재하지 않으면 생성
            }

            // 고유한 파일명 생성
            String originalFilename = imageFile.getOriginalFilename();
            String fileName = System.currentTimeMillis() + "_" + originalFilename;
            File destination = new File(uploadDir + fileName);

            // 파일 저장
            imageFile.transferTo(destination);

            // 저장된 파일의 접근 가능한 URL 경로 반환
            return "/uploads/" + fileName;
        } catch (IOException e) {
            throw new RuntimeException("Image file save failed", e);
        }
    }

    // 모든 채팅방 가져오기 -> 한 유저가 들어간 채팅방 가져오기
    public List<ChatJoin> getAllRooms(Member chatJoiner) {
        return this.chatJoinRepository.findByChatJoiner(chatJoiner);
    }

    public ChatRoom createRoom(String name, Member creator) {
        ChatRoom newRoom = ChatRoom.builder()
                .name(name)
                .build();
        ChatRoom savedRoom = chatRoomRepository.save(newRoom);

        // 채팅방 생성자를 채팅방에 자동으로 join
        ChatJoin chatJoin = ChatJoin.builder()
                .chatJoiner(creator)
                .chatRoom(savedRoom)
                .build();
        chatJoinRepository.save(chatJoin);

        return savedRoom;
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

    @Transactional
    public void deleteByMember(Member member) {
        // 회원이 참여한 모든 ChatJoin 찾기
        List<ChatJoin> chatJoins = chatJoinRepository.findByChatJoiner(member);

        for (ChatJoin chatJoin : chatJoins) {
            // 각 ChatJoin에 연관된 모든 ChatMessage 삭제
            chatMessageRepository.deleteByChatSender(chatJoin);

            // ChatJoin 삭제
            chatJoinRepository.delete(chatJoin);

            // 채팅방에 다른 참여자가 없다면 채팅방도 삭제
            ChatRoom chatRoom = chatJoin.getChatRoom();
            if (chatJoinRepository.countByChatRoom(chatRoom) == 0) {
                chatRoomRepository.delete(chatRoom);
            }
        }
    }

    public ChatRoom createRoomWithUsers(String roomName, Member creator, Member otherUser) {
        ChatRoom newRoom = ChatRoom.builder()
                .name(roomName)
                .build();
        ChatRoom savedRoom = chatRoomRepository.save(newRoom);

        ChatJoin creatorJoin = ChatJoin.builder()
                .chatJoiner(creator)
                .chatRoom(savedRoom)
                .build();
        ChatJoin otherUserJoin = ChatJoin.builder()
                .chatJoiner(otherUser)
                .chatRoom(savedRoom)
                .build();

        chatJoinRepository.save(creatorJoin);
        chatJoinRepository.save(otherUserJoin);

        return savedRoom;
    }
}
