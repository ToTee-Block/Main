package com.example.Main.domain.TechStack.dto;

import com.example.Main.domain.TechStack.entity.TechStack;
import lombok.Getter;
import lombok.ToString;

@ToString
@Getter
public class TechStackDTO {
    private final Long id;

    private final String name;

    public TechStackDTO(TechStack techStack) {
        this.id = techStack.getId();
        this.name = techStack.getName();
    }
}
