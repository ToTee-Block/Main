package com.example.Main.domain.Mentor.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class MentorRegistrationRequest {
    @NotBlank
    private String oneLineBio;

    @NotBlank
    private String bio;

    @NotBlank
    private String portfolio;

    /*private List<MentorTechStack> techStacks;*/
}
