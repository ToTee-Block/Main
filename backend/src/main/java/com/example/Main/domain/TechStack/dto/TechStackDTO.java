package com.example.Main.domain.TechStack.dto;

import com.example.Main.domain.TechStack.enums.TechStacks;
import lombok.Getter;
import lombok.ToString;

import java.util.List;

@ToString
@Getter
public class TechStackDTO {
    List<TechStacks> techStacks;

    public TechStackDTO(List<TechStacks> techStacks) {
        this.techStacks = techStacks;
    }
}
