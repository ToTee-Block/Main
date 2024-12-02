package com.example.Main.global.InitData;

import com.example.Main.domain.Member.enums.MemberGender;
import com.example.Main.domain.Member.enums.MemberRole;
import com.example.Main.domain.Member.service.MemberService;
import com.example.Main.domain.Mentor.service.MentorService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Configuration
public class Init {
    @Bean
    CommandLineRunner initData(MemberService memberService, MentorService mentorService) {
        long id = 4;

        return args -> {
            memberService.join("admin@email.com", "0000", "admin", LocalDate.now(), MemberGender.O, "",  MemberRole.ADMIN);
            memberService.join("mentor@email.com", "0000", "mentor", LocalDate.now(), MemberGender.O, "", MemberRole.MENTOR);
            mentorService.mentorRegistration(memberService.getMemberById(id), "hi", "hii", "hiii");
        };
    }
}