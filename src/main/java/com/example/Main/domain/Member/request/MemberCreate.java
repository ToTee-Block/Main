package com.example.Main.domain.Member.request;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Data
public class MemberCreate {
    @NotBlank
    private String username;
    @NotBlank
    private String password;
    @NotBlank
    private LocalDateTime birthDate;
    @NotBlank
    private char gender;
}
