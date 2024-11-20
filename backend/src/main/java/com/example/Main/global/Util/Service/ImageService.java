package com.example.Main.global.Util.Service;

import com.example.Main.domain.Member.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ImageService {
    @Value("${custom.fileDirPath}")
    private String fileDirPath;

    //    사진 저장: 원본 그대로
    public String saveImage(String folder, MultipartFile profileImg) {
        String imageNailrelPath = folder + "/" + UUID.randomUUID().toString() + ".jpg";
        File imageFile = new File(fileDirPath + "/" + imageNailrelPath);

        try {
            profileImg.transferTo(imageFile);
            return imageNailrelPath;
        } catch (IOException e) {
            throw new RuntimeException("img upload error");
        }
    }

    //    사진 저장: 사이즈 지정
    public String saveImage(String folder, MultipartFile profileImg, int width, int height) {
        // 저장할 이미지의 상대 경로 생성 (파일 이름에 UUID를 사용)
        String imageNailrelPath = folder + "/" + UUID.randomUUID().toString() + ".jpg";
        // 실제 파일 저장 경로 (fileDirPath는 시스템상의 절대 경로)
        File imageFile = new File(fileDirPath + "/" + imageNailrelPath);

        try {
            // 업로드된 이미지를 BufferedImage로 변환
            BufferedImage originalImage = ImageIO.read(profileImg.getInputStream());

            // 리사이즈된 이미지 생성
            Image resizedImage = originalImage.getScaledInstance(width, height, Image.SCALE_SMOOTH);

            // 리사이즈된 이미지를 BufferedImage로 변환
            BufferedImage outputImage = new BufferedImage(width, height, BufferedImage.TYPE_INT_ARGB);
            Graphics2D g2d = outputImage.createGraphics();
            g2d.drawImage(resizedImage, 0, 0, null);
            g2d.dispose();

            // 리사이즈된 이미지를 지정된 경로에 저장
            ImageIO.write(outputImage, "jpg", imageFile);

            return imageNailrelPath;  // 저장된 이미지의 상대 경로 반환
        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException("Image upload or resize failed.");
        }
    }
}
