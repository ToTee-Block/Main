package com.example.Main.domain.Member.request;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Data
public class AuthcodeRequest {
    @NotBlank
    private String authcode;
}
