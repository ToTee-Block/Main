package com.example.Main.domain.Chat.contrroller;

import com.example.Main.domain.Chat.dto.ChatDTO;
import com.example.Main.domain.Chat.entity.Chat;
import com.example.Main.domain.Chat.entity.ChatMessage;
import com.example.Main.domain.Chat.entity.ChatRoom;
import com.example.Main.domain.Chat.serivce.ChatService;
import com.example.Main.domain.Member.entity.Member;
import com.example.Main.domain.Member.service.MemberService;
import com.example.Main.global.Jwt.JwtProvider;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.jsoup.HttpStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

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

    @MessageMapping("/message")
    @PreAuthorize("isAuthenticated()")
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
        chatService.saveMessage(chatDTO);

        // 메시지를 전송하는 방의 ID와 일치하는 채팅방에 메시지를 전송
        String destination = "/sub/chatroom/" + chatDTO.getRoomId();
        if (!principal.getName().equals(member.getName())) {
            // 본인에게 메시지 전송하지 않도록 예외 처리
            ChatDTO enrichedChatDTO = new ChatDTO(
                    chatDTO.getRoomId(),
                    member.getId(),
                    chatDTO.getMessage(),
                    LocalDateTime.now()
            );
            templates.convertAndSend(destination, enrichedChatDTO);
            System.out.println("Message broadcasted to: " + destination);
        }
    }


    @GetMapping("/chat/{roomId}/messages")
    public ResponseEntity<List<ChatDTO>> getMessages(@PathVariable("roomId") Long roomId) {
        try {
            List<ChatMessage> messages = chatService.getMessagesByRoomId(roomId);
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
