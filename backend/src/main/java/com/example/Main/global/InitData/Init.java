package com.example.Main.global.InitData;

import com.example.Main.domain.Member.enums.MemberGender;
import com.example.Main.domain.Member.enums.MemberRole;
import com.example.Main.domain.Member.service.MemberService;
import com.example.Main.domain.Post.service.PostService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;

@Configuration
public class Init {
    @Bean
    CommandLineRunner initData(MemberService memberService, PostService postService) {
        return args -> {
            // 회원
            memberService.join("admin@email.com", "0000", "admin", LocalDate.now(), MemberGender.O, "",  MemberRole.ADMIN);
            memberService.join("mentor@email.com", "0000", "mentor", LocalDate.now(), MemberGender.O, "", MemberRole.MENTOR);
        };
    }
}