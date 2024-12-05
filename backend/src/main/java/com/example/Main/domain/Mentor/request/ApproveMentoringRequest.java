package com.example.Main.domain.Mentor.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ApproveMentoringRequest {    // 멘토가 신청받은 멘토링을 허가 및 거절할 때 사용하는 request
    @NotNull
    private Long matchingId;

    @NotNull
    private boolean approve;
}
