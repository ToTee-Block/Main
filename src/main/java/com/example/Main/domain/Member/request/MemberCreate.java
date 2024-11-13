package com.example.Main.domain.Member.request;

import com.example.Main.domain.Member.enums.MemberGender;
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
    private LocalDateTime birthDate;    // 예시형식: "2024-11-12T14:30:00"
    @NotBlank
    private MemberGender gender;    // 예시형식: "M"
}
