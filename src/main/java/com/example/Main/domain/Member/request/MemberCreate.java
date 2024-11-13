package com.example.Main.domain.Member.request;

import com.example.Main.domain.Member.enums.MemberGender;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Data
public class MemberCreate {
    @NotBlank
    private String username;
    @NotBlank
    private String password;
    @NotNull
    private LocalDateTime birthDate;    // 예시형식: "2024-11-12T14:30:00"
    @NotNull
    private MemberGender gender;    // 예시형식: "M"
}