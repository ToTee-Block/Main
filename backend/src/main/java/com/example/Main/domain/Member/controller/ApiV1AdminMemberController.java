package com.example.Main.domain.Member.controller;

import com.example.Main.domain.Chat.serivce.ChatService;
import com.example.Main.domain.Member.dto.MemberDTO;
import com.example.Main.domain.Member.entity.Member;
import com.example.Main.domain.Member.service.MemberService;
import com.example.Main.domain.notification.repository.NotificationRepository;
import com.example.Main.domain.notification.service.NotificationService;
import com.example.Main.global.RsData.RsData;
import com.example.Main.global.Security.SecurityMember;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin/members")
public class ApiV1AdminMemberController {
    private final MemberService memberService;
    private final NotificationService notificationService;
    private final ChatService chatService;

    @PreAuthorize("isAuthenticated()")
    @GetMapping("")
    public RsData<Page<MemberDTO>> getMemberList(@RequestParam(value = "page", defaultValue = "0") int page) {
        Page<MemberDTO> members = this.memberService.getMemberList(page);
        return RsData.of("200", "회원 리스트", members);
    }

    @Transactional
    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/delete/{memberId}")
    public RsData delete(@PathVariable(value = "memberId") Long id) {
        try {
            Member member = this.memberService.getMemberById(id);
            if (member == null) {
                return RsData.of("404", "존재하지 않는 사용자입니다.");
            }

            // 채팅 관련 데이터 삭제
            this.chatService.deleteByMember(member);

            // 알림 삭제
            this.notificationService.deleteAllByMember(member);

            // 회원 삭제
            this.memberService.deleteMember(member);

            return RsData.of("200", "삭제 성공");
        } catch (Exception e) {
            e.printStackTrace();
            return RsData.of("500", "삭제 중 오류 발생: " + e.getMessage());
        }
    }
}