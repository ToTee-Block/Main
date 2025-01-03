package com.example.Main.global.Util.Service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ImageService {
    @Value("${custom.fileDirPath}")
    private String fileDirPath;

    // 절대 경로 생성
    private Path getAbsolutePath(String folder, String fileName) {
        return Paths.get(System.getProperty("user.dir"), fileDirPath, folder, fileName);
    }

    // 디렉토리 생성 (필요시)
    private void ensureDirectoryExists(Path path) {
        try {
            Files.createDirectories(path.getParent());
        } catch (IOException e) {
            throw new RuntimeException("Failed to create directory: " + path.getParent(), e);
        }
    }

    // 경로를 항상 '/'로 반환
    private String normalizePath(Path path) {
        return path.toString().replace("\\", "/");
    }

    // 사진 저장: 원본 그대로
    public String saveImage(String folder, MultipartFile profileImg) {
        String fileName = UUID.randomUUID().toString() + ".jpg";
        Path filePath = getAbsolutePath(folder, fileName);

        ensureDirectoryExists(filePath);

        try {
            profileImg.transferTo(filePath.toFile());
            return normalizePath(Paths.get(folder, fileName)); // 상대 경로 반환
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload image: " + filePath, e);
        }
    }

    // 사진 저장: 리사이즈
    public String saveImage(String folder, MultipartFile profileImg, int width, int height) {
        String fileName = UUID.randomUUID().toString() + ".jpg";
        Path filePath = getAbsolutePath(folder, fileName);

        ensureDirectoryExists(filePath);

        try {
            BufferedImage originalImage = ImageIO.read(profileImg.getInputStream());

            // 리사이즈된 이미지 생성
            Image resizedImage = originalImage.getScaledInstance(width, height, Image.SCALE_SMOOTH);
            BufferedImage outputImage = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
            Graphics2D g2d = outputImage.createGraphics();
            g2d.drawImage(resizedImage, 0, 0, null);
            g2d.dispose();

            // 리사이즈된 이미지를 저장
            ImageIO.write(outputImage, "jpg", filePath.toFile());

            return normalizePath(Paths.get(folder, fileName)); // 상대 경로 반환
        } catch (IOException e) {
            throw new RuntimeException("Failed to resize and save image: " + filePath, e);
        }
    }
}