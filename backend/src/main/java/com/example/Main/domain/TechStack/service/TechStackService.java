package com.example.Main.domain.TechStack.service;

import com.example.Main.domain.TechStack.dto.TechStackDTO;
import com.example.Main.domain.TechStack.entity.TechStack;
import com.example.Main.domain.TechStack.repository.TechStackRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TechStackService {
    private final TechStackRepository techStackRepository;

    public TechStackDTO addTechStack(String name) {
        TechStack techStack = TechStack.builder()
                .name(name)
                .build();
        this.techStackRepository.save(techStack);
        return new TechStackDTO(techStack);
    }
}
