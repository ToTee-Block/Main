package com.example.Main.domain.Member.controller;

import com.example.Main.domain.Member.entity.Member;
import com.example.Main.domain.Member.service.MemberService;
import com.example.Main.global.RsData.RsData;
import com.example.Main.global.Security.SecurityMember;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin/members")
public class ApiV1AdminMemberController {
    private final MemberService memberService;
    private final ApiV1MemberController memberController;

    @PreAuthorize("isAuthecticated()")
    @GetMapping("")
    private RsData getMemberList(@RequestParam(value = "page", defaultValue = "0") int page) {
        Page<Member> members = this.memberService.getList(page);

        return RsData.of("200", "회원 리스트", members);
    }

    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/delete/{memberId}")
    private RsData delete(@PathVariable(value = "memberId")Long id) {
        return this.memberController.delete(id);
    }
}
