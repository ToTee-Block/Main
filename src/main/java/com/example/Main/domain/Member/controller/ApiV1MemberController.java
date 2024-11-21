package com.example.Main.domain.Member.controller;

import com.example.Main.domain.Email.service.EmailService;
import com.example.Main.domain.Member.dto.MemberDTO;
import com.example.Main.domain.Member.entity.Member;
import com.example.Main.domain.Member.enums.MemberGender;
import com.example.Main.domain.Member.enums.MemberRole;
import com.example.Main.domain.Member.request.AuthcodeRequest;
import com.example.Main.domain.Member.request.MemberCreate;
import com.example.Main.domain.Member.request.MemberRequest;
import com.example.Main.domain.Member.service.MemberService;
import com.example.Main.global.Jwt.JwtProvider;
import com.example.Main.global.RsData.RsData;
import com.example.Main.global.TEST.EmptyMultipartFile;
import com.example.Main.global.Util.Service.ImageService;
import com.example.Main.global.Util.Util;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/members")
public class ApiV1MemberController {
    private final MemberService memberService;
    private final JwtProvider jwtProvider;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final ImageService imageService;

    private static String generatedAuthcode = "";

    @PostMapping("/join")
    public RsData join(@Valid @RequestBody MemberCreate memberCreate) {
        // 회원가입에 필요한 필드 나열
        String email = memberCreate.getEmail();
        String password = memberCreate.getPassword();
        String name = memberCreate.getName();
        LocalDate birthDate = memberCreate.getBirthDate();
        MemberGender gender = memberCreate.getGender();
        MultipartFile profileImg = new EmptyMultipartFile();  // TODO: json으로 파일 처리를 못해서 빈 객체 생성. 추후에 post요청으로 받은 file로 변경하기

        // 프로필 사진 저장
        String savedProfileImg = null;
        if (!profileImg.isEmpty()) {
            savedProfileImg = this.imageService.saveImage("user", profileImg, 200, 200);
        }

        // 회원가입
        MemberDTO memberDTO = this.memberService.join(email, password, name, birthDate, gender, savedProfileImg, MemberRole.USER);

        if (memberDTO == null) {
            return RsData.of("400", "이미 존재하는 사용자입니다.");
        }
        return RsData.of("200", "회원가입 성공", memberDTO);
    }

    @PostMapping("/login")
    public RsData login (@Valid @RequestBody MemberRequest memberRequest, HttpServletResponse res) {
        Member member = this.memberService.getMemberByEmail(memberRequest.getEmail());

        if (!passwordEncoder.matches(memberRequest.getPassword(), member.getPassword())) {
            return RsData.of("400", "비밀번호가 일치하지 않습니다.");
        }

        String accessToken = jwtProvider.genAccessToken(member);
        Cookie accessTokenCookie  = new Cookie("accessToken", accessToken);
        accessTokenCookie.setHttpOnly(true);
        accessTokenCookie.setSecure(true);
        accessTokenCookie.setPath("/");
        accessTokenCookie.setMaxAge(60 * 60 * 24);   // 로그인 지속 시간: 24h
        res.addCookie(accessTokenCookie);


        String refreshToken = member.getRefreshToken();
        Cookie refreshTokenCookie  = new Cookie("refreshToken", refreshToken);
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setSecure(true);
        refreshTokenCookie.setPath("/");
        refreshTokenCookie.setMaxAge(60 * 60 * 24);   // 로그인 지속 시간: 24h
        res.addCookie(refreshTokenCookie);

        return RsData.of("200", "토큰 발급 성공: " + accessToken , new MemberDTO(member));
    }

    @GetMapping("/logout")
    public RsData logout(HttpServletResponse res) {
        Cookie accessTokenCookie = new Cookie("accessToken", null);
        accessTokenCookie.setPath("/");
        accessTokenCookie.setMaxAge(0);
        res.addCookie(accessTokenCookie);

        Cookie refreshTokenCookie = new Cookie("refreshToken", null);
        refreshTokenCookie.setPath("/");
        refreshTokenCookie.setMaxAge(0);
        res.addCookie(refreshTokenCookie);

        return RsData.of("200", "로그아웃 성공");
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/me")  // 로그인된 사용자 정보 확인하기
    public RsData getMe (HttpServletRequest req) {
        Cookie[] cookies = req.getCookies();
        String accessToken = "";
        if (cookies == null) {
            return RsData.of("400", "유효성 검증 실패");
        }

        for (Cookie cookie : cookies) {
            if ("accessToken".equals(cookie.getName())) {
                accessToken = cookie.getValue();
            }
        }

        Map<String, Object> claims =  jwtProvider.getClaims(accessToken);
        String email = (String) claims.get("email");
        Member member = this.memberService.getMemberByEmail(email);

        return RsData.of("200", "내 회원정보", new MemberDTO(member));
    }

    @PreAuthorize("isAuthenticated()")
    @PatchMapping("/profile")
    public RsData modifyProfile(@Valid @RequestBody MemberCreate memberCreate) {
        // 수정 시 필요한 필드 나열
        String email = memberCreate.getEmail();
        String newPassword = memberCreate.getPassword();
        String newName = memberCreate.getName();
        LocalDate newBirthDate = memberCreate.getBirthDate();
        MemberGender newGender = memberCreate.getGender();
        MultipartFile newProfileImg = new EmptyMultipartFile();   // TODO: json으로 파일 처리를 못해서 빈 객체 생성. 추후에 post요청으로 받은 file로 변경하기

        // 프로필 사진 저장
        String savedProfileImg = null;
        if (!newProfileImg.isEmpty()) {
            savedProfileImg = this.imageService.saveImage("user", newProfileImg);
        }

        Member member = this.memberService.getMemberByEmail(email);

        Member modifiedMember = this.memberService.modifyProfile(member, newPassword, newName, newBirthDate, newGender, savedProfileImg);

        return RsData.of("200", "프로필 변경 성공", new MemberDTO(modifiedMember));
    }

    @PatchMapping("/password")
    public RsData modifyPassword(@Valid @RequestBody MemberRequest memberRequest) {
        Member member = this.memberService.modifyPassword(memberRequest.getEmail(), memberRequest.getPassword());

        return RsData.of("200", "비밀번호 변경 성공", new MemberDTO(member));
    }

    @PostMapping("/code/send")
    public RsData sendCode(@Valid @RequestBody MemberRequest memberRequest) {
        this.generatedAuthcode = Util.generateAuthCode(6);
        String emailContents = String.format("이메일 인증 코드 : %s", this.generatedAuthcode);

        return this.emailService.send(memberRequest.getEmail(), "ToTeeBlocks 인증코드", emailContents);
    }

    @PostMapping("/code/auth")
    public RsData authCode(@Valid @RequestBody AuthcodeRequest authcodeRequest) {
        if (!this.generatedAuthcode.equals(authcodeRequest.getAuthcode())) {
            return RsData.of("400", "인증코드가 일치하지 않습니다.");
        }
        return RsData.of("200", "인증 성공", this.generatedAuthcode);
    }
}
