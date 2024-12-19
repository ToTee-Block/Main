package com.example.Main.domain.Chat.controller;

import com.example.Main.domain.Chat.dto.ChatDTO;
import com.example.Main.domain.Chat.entity.ChatMessage;
import com.example.Main.domain.Chat.entity.ChatRoom;
import com.example.Main.domain.Chat.serivce.ChatService;
import com.example.Main.domain.Member.entity.Member;
import com.example.Main.domain.Member.service.MemberService;
import com.example.Main.global.Jwt.JwtProvider;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.File;
import java.security.Principal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ChatController {
    private final ChatService chatService;
    private final SimpMessageSendingOperations templates;
    private final JwtProvider jwtProvider;
    private final MemberService memberService;

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/chat/rooms")
    public ResponseEntity<List<Map<String, Object>>> getChatRooms(Principal principal) {
        Member chatJoiner = this.memberService.getMemberByEmail(principal.getName());
        if (chatJoiner == null) {
            System.out.println("Unauthorized message received");
            return ResponseEntity.badRequest().build();
        }

        List<Map<String, Object>> chatRooms = chatService.getAllRooms(chatJoiner).stream()
                .map(room -> {
                    Map<String, Object> roomMap = new HashMap<>();
                    roomMap.put("id", room.getChatRoom().getId());
                    roomMap.put("name", room.getChatRoom().getName());
                    return roomMap;
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(chatRooms);
    }

    /* create 타이밍 : 나중에 멘토등록 승인되면 그 멘토의 방이 만들어지게 하기 */
    @PostMapping("/chat/rooms")
    public ResponseEntity<Map<String, Object>> createChatRoom(@RequestBody Map<String, String> requestBody) {
        String roomName = requestBody.get("name");
        if (roomName == null || roomName.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Room name cannot be empty"));
        }
        var newRoom = chatService.createRoom(roomName);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "id", newRoom.getId(),
                "name", newRoom.getName()
        ));
    }

    /* delete 타이밍 : 멘토가 탈퇴하거나 멘토자격 해제될 때(=mentor 테이블이 없어질 때) */
    @DeleteMapping("/chat/{roomId}")
    public ResponseEntity<Map<String, Object>> deleteChatRoom(@PathVariable Long roomId) {
        try {
            chatService.deleteRoom(roomId);
            return ResponseEntity.ok(Map.of("message", "Room deleted successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Invalid room ID"));
        }
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/chat/{roomId}")
    public ResponseEntity<Map<String, Object>> getChatRoomDetails(@PathVariable("roomId") Long roomId, Principal principal) {
        try {
            Member chatJoiner = this.memberService.getMemberByEmail(principal.getName());
            ChatRoom roomDetails = this.chatService.getRoomDetails(roomId);
            if (!this.chatService.isJoiner(chatJoiner.getId(), roomDetails.getId())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User does not have author to join room.");
            }
            return ResponseEntity.ok(Map.of(
                    "id", roomDetails.getId(),
                    "name", roomDetails.getName(),
                    "createdAt", roomDetails.getCreatedDate()
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Room not found"));
        }
    }


    @PreAuthorize("isAuthenticated()")
    @MessageMapping("/message")
    public void receiveMessage(ChatDTO chatDTO, Principal principal) {
        // 현재 로그인한 사용자 정보 가져오기
        Member member = this.memberService.getMemberByEmail(principal.getName());
        if (member == null) {
            System.out.println("Unauthorized message received");
            return;
        }

        System.out.println("Message received: " + chatDTO);

        // 메시지 저장
        chatDTO.setSenderId(member.getId());
        chatDTO.setSenderName(member.getName()); // 사용자의 이름 추가
        chatService.saveMessage(chatDTO);

        // 메시지를 전송하는 방의 ID와 일치하는 채팅방에 메시지를 전송
        String destination = "/sub/chatroom/" + chatDTO.getRoomId();

        // 메시지 타입 설정: 이미지인지 텍스트인지 확인
        String contentType = chatDTO.getMessage().startsWith("/uploads/") ? "image" : "text";
        String messageType = "sent"; // 기본적으로 보낸 사람의 메시지는 "sent"
        if (!chatDTO.getSenderId().equals(member.getId())) {
            messageType = "received"; // 상대방 메시지는 "received"
        }

        // enrichedChatDTO 객체 생성 시, 타입 추가
        ChatDTO enrichedChatDTO = new ChatDTO(
                chatDTO.getRoomId(),
                member.getId(),
                chatDTO.getMessage(), // 메시지 내용 (URL 또는 텍스트)
                LocalDateTime.now(),
                member.getName(), // 보낸 사람의 이름 추가
                null,             // senderProfile (추가할 경우 수정)
                messageType,      // sent 또는 received
                contentType       // 이미지 또는 텍스트 타입
        );

        templates.convertAndSend(destination, enrichedChatDTO); // 메시지 전송
        System.out.println("Message broadcasted to: " + destination);
    }



    @PreAuthorize("isAuthenticated()")
    @GetMapping("/chat/{roomId}/messages")
    public ResponseEntity<List<ChatDTO>> getMessages(@PathVariable("roomId") Long roomId, Principal principal) {
        try {
            Long currentUserId = this.memberService.getMemberByEmail(principal.getName()).getId();
            if (currentUserId == null) {
                throw new IllegalArgumentException("User is not authenticated");
            }

            // 해당 방의 메시지 목록을 가져옵니다
            List<ChatMessage> messages = chatService.getMessagesByRoomId(roomId);

            // 메시지 목록을 ChatDTO로 변환하고, 메시지 타입을 구분하여 설정
            List<ChatDTO> messageDTOs = messages.stream()
                    .map(message -> {
                        ChatDTO dto = chatService.toDTO(message);
                        dto.setSenderName(
                                message.getChatSender() != null
                                        ? message.getChatSender().getChatJoiner().getName()
                                        : "Unknown"
                        );

                        // senderProfile 설정 추가
                        dto.setSenderProfile(
                                null
                                /*message.getChatSender() != null
                                        ? message.getChatSender().getChatJoiner().getProfileImage() // 프로필 이미지가 있는 경우
                                        : null*/
                        );

                        // senderId와 currentUserId를 비교하여 메시지 타입을 설정
                        if (message.getChatSender() != null && message.getChatSender().getChatJoiner().getId().equals(currentUserId)) {
                            dto.setType("sent"); // 내 메시지
                        } else {
                            dto.setType("received"); // 상대방의 메시지
                        }
                        return dto;
                    })
                    .toList();

            return ResponseEntity.ok(messageDTOs);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            e.printStackTrace(); // 디버깅용 로그
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    @PostMapping("/chat/{roomId}/upload")
    public ResponseEntity<?> uploadImage(@PathVariable("roomId") Long roomId, @RequestParam("image") MultipartFile file) {
        try {
            String uploadDir = "C:/work/Main/uploads/"; //C:/work/IdeaProjects/ToTeeBlock/uploads/
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename().replaceAll("[^a-zA-Z0-9.]", "_");

            File dest = new File(uploadDir + fileName);
            file.transferTo(dest);

            String imageUrl = "/uploads/" + fileName;
            return ResponseEntity.ok(Map.of("imageUrl", imageUrl));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to upload image");
        }
    }

    private Member getAuthenticatedMember(HttpServletRequest req) {
        Cookie[] cookies = req.getCookies();
        String accessToken = "";

        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("accessToken".equals(cookie.getName())) {
                    accessToken = cookie.getValue();
                    break;
                }
            }
        }

        if (accessToken.isEmpty() || !memberService.validateToken(accessToken)) {
            return null;
        }

        Map<String, Object> claims = jwtProvider.getClaims(accessToken);
        String email = (String) claims.get("email");
        return memberService.getMemberByEmail(email);
    }
}
