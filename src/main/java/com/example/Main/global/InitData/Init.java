package com.example.Main.global.InitData;

import com.example.Main.domain.Member.enums.MemberGender;
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
            memberService.join("admin", "0000", LocalDateTime.now(), MemberGender.O);
        };
    }
}