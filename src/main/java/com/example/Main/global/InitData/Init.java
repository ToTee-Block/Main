package com.example.Main.global.InitData;

import com.example.Main.domain.Member.enums.MemberGender;
import com.example.Main.domain.Member.enums.MemberRole;
import com.example.Main.domain.Member.service.MemberService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;

@Configuration
public class Init {
    @Bean
    CommandLineRunner initData(MemberService memberService) {

        return args -> {
            memberService.join("admin@email.com", "0000", "admin", LocalDateTime.now(), MemberGender.O, "",  MemberRole.ADMIN);
            memberService.join("mentor@email.com", "0000", "mentor", LocalDateTime.now(), MemberGender.O, "", MemberRole.MENTOR);
        };
    }
}