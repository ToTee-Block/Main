package com.example.Main.domain.Mentor.request;

import com.example.Main.domain.Mentor.entity.MentorTechStack;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

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
