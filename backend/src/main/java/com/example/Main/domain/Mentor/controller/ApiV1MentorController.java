package com.example.Main.domain.Mentor.controller;

import com.example.Main.domain.Mentor.service.MentorService;
import com.example.Main.global.RsData.RsData;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/mentors")
public class ApiV1MentorController {
    private final MentorService mentorService;

    @PostMapping("/registration")
    public RsData<?> mentorRegistration() {

    }
}
