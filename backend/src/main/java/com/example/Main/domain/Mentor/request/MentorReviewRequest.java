package com.example.Main.domain.Mentor.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class MentorReviewRequest {
    @NotNull
    private Long mentorId;

    @NotNull
    private Long reviewerId;

    @NotBlank
    private String content;
}