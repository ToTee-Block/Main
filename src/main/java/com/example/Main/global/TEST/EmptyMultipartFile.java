package com.example.Main.global.TEST;

import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;

public class EmptyMultipartFile implements MultipartFile {

    @Override
    public String getName() {
        return "profileImg";
    }

    @Override
    public String getOriginalFilename() {
        return "empty.jpg"; // 원본 파일 이름
    }

    @Override
    public String getContentType() {
        return "image/jpeg";
    }

    @Override
    public boolean isEmpty() {
        return true; // 빈 파일임을 나타냄
    }

    @Override
    public long getSize() {
        return 0; // 파일 크기
    }

    @Override
    public byte[] getBytes() throws IOException {
        return new byte[0]; // 빈 byte 배열 반환
    }

    @Override
    public InputStream getInputStream() throws IOException {
        return new ByteArrayInputStream(new byte[0]); // 빈 InputStream 반환
    }

    @Override
    public void transferTo(File dest) throws IOException, IllegalStateException {
        // 파일 전송을 구현하려면 여기에 처리 로직을 추가
    }
}
