package com.example.Main.domain.Mentor.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ApproveMentorRequest {    // 관리자가 멘토를 허가할 때 사용하는 request
    @NotNull
    private Long mentorId;

    @NotNull
    private boolean approve;
}
