package com.example.Main.domain.Member.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class PasswordChangeRequest {
    @NotBlank(message = "현재 비밀번호를 입력해주세요.")
    private String currentPassword;

    @NotBlank(message = "새 비밀번호를 입력해주세요.")
//    @Size(min = 8, message = "비밀번호는 최소 8자 이상이어야 합니다.") // 보안 추가할거면 주석 풀기
    private String newPassword;
}