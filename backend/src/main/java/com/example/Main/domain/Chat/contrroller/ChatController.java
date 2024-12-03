package com.example.Main.domain.Chat.contrroller;

import com.example.Main.domain.Chat.dto.ChatDTO;
import com.example.Main.domain.Member.entity.Member;
import com.example.Main.domain.Member.service.MemberService;
import com.example.Main.global.Jwt.JwtProvider;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class ChatController {

    private  final SimpMessageSendingOperations templates;
    private  final JwtProvider jwtProvider;
    private  final MemberService memberService;

    @GetMapping("/api/v1/chat/{id}") // id는 사용자 ID
    public ResponseEntity<List<String>> getChatRooms(@PathVariable Long id) {
        List<String> chatRooms = List.of("박승수", "관리자"); // 예시 데이터
        // DB 연동 시 실제 데이터를 반환하도록 수정
        return ResponseEntity.ok().body(chatRooms);
    }

    @MessageMapping("/api/v1/message")//메세지 송신 및 수신,pub가 생략된 모습 클라이언트 단 에선 /pub/message로 요청
    public ResponseEntity<Void> receiveMessage(@RequestBody ChatDTO chat, HttpServletRequest req) {
        // JWT를 통해 로그인된 사용자 정보 가져오기
        Member member = getAuthenticatedMember(req);
        if (member == null) {
            return ResponseEntity.status(401).build(); // 인증 실패
        }
        // 로그인된 사용자 정보를 포함한 ChatDTO 생성
        ChatDTO enrichedChat = new ChatDTO(
                member.getId(),
                member.getName(),
                chat.getMessage(),
                LocalDateTime.now()
        );

        // WebSocket을 통해 클라이언트로 메시지 전송
        templates.convertAndSend("/api/v1/sub/chatroom/1", enrichedChat);

        return ResponseEntity.ok().build();
    }

    // 인증된 사용자 정보 가져오기
    private Member getAuthenticatedMember(HttpServletRequest req) {
        Cookie[] cookies = req.getCookies();
        String accessToken = "";

        // 쿠키에서 accessToken 추출
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("accessToken".equals(cookie.getName())) {
                    accessToken = cookie.getValue();
                    break;
                }
            }
        }

        if (accessToken.isEmpty() || !memberService.validateToken(accessToken)) {
            return null; // 유효하지 않은 토큰
        }

        // JWT에서 이메일 추출 및 사용자 조회
        Map<String, Object> claims = jwtProvider.getClaims(accessToken);
        String email = (String) claims.get("email");
        return memberService.getMemberByEmail(email);
    }
}