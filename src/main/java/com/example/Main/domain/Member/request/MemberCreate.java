package com.example.Main.domain.Member.request;

import com.example.Main.domain.Member.enums.MemberGender;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.io.File;
import java.time.LocalDateTime;

@Data
public class MemberCreate {
    @NotBlank
    private String email;
    @NotBlank
    private String password;
    @NotBlank
    private String name;
    @NotNull
    private LocalDateTime birthDate;    // 예시형식: "2024-11-12T14:30:00"
    @NotNull
    private MemberGender gender;    // 예시형식: "M"
}
