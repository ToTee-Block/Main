package com.example.Main.domain.TechStack.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TechStackAddRequest {
    @NotBlank
    private String name;
}
