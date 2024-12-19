package com.example.Main.domain.TechStack.controller;

import com.example.Main.domain.TechStack.enums.TechStacks;
import com.example.Main.global.RsData.RsData;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/api/v1/techStacks")
public class ApiV1TechStackController {
    @GetMapping("")
    public RsData getStacks() {
        return RsData.of("200", "기술스택 리스트", TechStacks.printAllTechStacks());
    }
}
