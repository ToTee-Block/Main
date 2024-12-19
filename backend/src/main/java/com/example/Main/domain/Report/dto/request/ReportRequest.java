package com.example.Main.domain.Report.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReportRequest {
    @NotNull(message = "코드는 필수 입력사항입니다.")
    private int reportCode;

    private String additionalNote;
}