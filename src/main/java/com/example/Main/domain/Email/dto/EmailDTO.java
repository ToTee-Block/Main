package com.example.Main.domain.Email.dto;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.Getter;
import lombok.ToString;

import java.io.IOException;

@ToString
@Getter
public class EmailDTO {
    private final String subject;

    private final String content;

    public EmailDTO(MimeMessage mimeMessage) throws MessagingException, IOException {
        this.subject = mimeMessage.getSubject();
        this.content = (String) mimeMessage.getContent();
    }
}