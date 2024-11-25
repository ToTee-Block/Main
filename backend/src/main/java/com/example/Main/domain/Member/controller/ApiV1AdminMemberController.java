package com.example.Main.domain.Member.controller;

import com.example.Main.domain.Member.entity.Member;
import com.example.Main.domain.Member.service.MemberService;
import com.example.Main.global.RsData.RsData;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin/member")
public class ApiV1AdminMemberController {
    private final MemberService memberService;
    private final ApiV1MemberController memberController;

    @GetMapping("")
    public RsData memberList(@RequestParam(value="page", defaultValue="0") int page) {
        Page<Member> paging = this.memberService.getList(page);

        return RsData.of("200", "회원 리스트", paging.getContent());
    }

    @DeleteMapping("/delete/{memberId}")
    public RsData delete(@PathVariable(value="memberId") Long id) {
        return memberController.delete(id);
    }
}
