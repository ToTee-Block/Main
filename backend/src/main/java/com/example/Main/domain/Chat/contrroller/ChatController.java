package com.example.Main.domain.Chat.contrroller;

import com.example.Main.domain.Chat.dto.ChatDTO;
import com.example.Main.domain.Chat.entity.Chat;
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

    @GetMapping("/chat/rooms")
    public ResponseEntity<List<Map<String, Object>>> getChatRooms() {
        List<Map<String, Object>> chatRooms = chatService.getAllRooms().stream()
                .map(room -> {
                    Map<String, Object> roomMap = new HashMap<>();
                    roomMap.put("id", room.getId());
                    roomMap.put("name", room.getName());
                    return roomMap;
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(chatRooms);
    }

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

    @DeleteMapping("/chat/{roomId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> deleteChatRoom(@PathVariable("roomId") Long roomId) {
        try {
            chatService.deleteRoom(roomId);
            return ResponseEntity.ok(Map.of("message", "Room deleted successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Invalid room ID"));
        }
    }

    @GetMapping("/chat/{roomId}")
    public ResponseEntity<Map<String, Object>> getChatRoomDetails(@PathVariable("roomId") Long roomId) {
        try {
            var roomDetails = chatService.getRoomDetails(roomId);
            return ResponseEntity.ok(Map.of(
                    "id", roomDetails.getId(),
                    "name", roomDetails.getName(),
                    "createdAt", roomDetails.getCreatedAt()
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Room not found"));
        }
    }

    @MessageMapping("/message")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ChatDTO> receiveMessage(ChatDTO chatDTO, Principal principal) {
        Member member = memberService.getMemberByEmail(principal.getName());
        if (member == null) {
            System.out.println("Unauthorized message received");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        System.out.println("Message received: " + chatDTO);

        // 메시지 저장
        Chat savedChat = chatService.saveMessages(chatDTO, member);

        // 저장된 메시지 정보 반환
        ChatDTO enrichedChatDTO = chatService.toDTO(savedChat);
        templates.convertAndSend("/sub/chatroom/" + chatDTO.getId(), enrichedChatDTO);
        System.out.println("Message broadcasted to: /sub/chatroom/" + chatDTO.getId());

        return ResponseEntity.ok(enrichedChatDTO);
    }



    @GetMapping("/chat/{roomId}/messages")
    public ResponseEntity<List<ChatDTO>> getMessages(@PathVariable("roomId") Long roomId) {
        try {
            List<Chat> messages = chatService.getMessagesByRoomId(roomId);
            List<ChatDTO> messageDTOs = messages.stream()
                    .map(chatService::toDTO)
                    .toList();
            return ResponseEntity.ok(messageDTOs);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            e.printStackTrace(); // 디버깅용 로그
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    @DeleteMapping("/chat/messages/{messageId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteMessage(@PathVariable("messageId") Long messageId) {
        try {
            if (messageId == null || messageId <= 0) {
                System.err.println("Invalid Message ID: " + messageId);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
            }

            boolean deleted = chatService.deleteMessageById(messageId);
            if (deleted) {
                System.out.println("Message deleted successfully: " + messageId);
                return ResponseEntity.ok().build();
            } else {
                System.err.println("Message not found: " + messageId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
        } catch (Exception e) {
            System.err.println("Error deleting message: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
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
