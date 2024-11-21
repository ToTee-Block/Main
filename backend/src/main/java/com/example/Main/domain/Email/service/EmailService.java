package com.example.Main.domain.Email.service;

import com.example.Main.domain.Email.dto.EmailDTO;
import com.example.Main.global.RsData.RsData;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;

    public RsData send(String to, String subject, String body) {

        MimeMessage mimeMessage = mailSender.createMimeMessage();

        try {
            MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, false, "UTF-8");
            mimeMessageHelper.setTo(to); // 메일 수신자
            mimeMessageHelper.setSubject(subject); // 메일 제목
            mimeMessageHelper.setText(body, true); // 메일 본문 내용, HTML 여부
            mailSender.send(mimeMessage); // 메일발송
            return RsData.of("200", "이메일 발송에 성공하였습니다.", new EmailDTO(mimeMessage));
        } catch (MessagingException e) {
            return RsData.of("400", "이메일 발송에 실패했습니다: " + e.getMessage());
        } catch (IOException e) {
            throw new RuntimeException(e);  // 이메일 발송 성공 시, EmailDTO 객체생성 예외처리
        }

    }
}
