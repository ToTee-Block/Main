package com.example.Main.domain.Member.request;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Data
public class MemberRequest {
    @NotBlank
    private String email;
    @NotBlank
    private String password;
}
