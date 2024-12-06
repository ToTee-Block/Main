package com.example.Main.domain.Member.controller;

import com.example.Main.domain.Email.service.EmailService;
import com.example.Main.domain.Member.dto.MemberDTO;
import com.example.Main.domain.Member.entity.Member;
import com.example.Main.domain.Member.enums.MemberGender;
import com.example.Main.domain.Member.enums.MemberRole;
import com.example.Main.domain.Member.request.AuthcodeRequest;
import com.example.Main.domain.Member.request.MemberCreate;
import com.example.Main.domain.Member.request.MemberRequest;
import com.example.Main.domain.Member.request.PasswordChangeRequest;
import com.example.Main.domain.Member.request.PasswordChangeRequest;
import com.example.Main.domain.Member.service.MemberService;
import com.example.Main.domain.Mentor.dto.MentorDTO;
import com.example.Main.domain.Mentor.entity.Mentor;
import com.example.Main.domain.Mentor.entity.MentorMenteeMatching;
import com.example.Main.domain.Mentor.service.MentorMenteeMatchingService;
import com.example.Main.domain.Mentor.service.MentorService;
import com.example.Main.global.Jwt.JwtProvider;
import com.example.Main.global.RsData.RsData;
import com.example.Main.global.TEST.EmptyMultipartFile;
import com.example.Main.global.Util.Service.ImageService;
import com.example.Main.global.Util.Util;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/members")
public class ApiV1MemberController {
    private final MemberService memberService;
    private final MentorService mentorService;
    private final MentorMenteeMatchingService matchingService;
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
    public RsData login(@Valid @RequestBody MemberRequest memberRequest, HttpServletResponse res) {
        Member member = this.memberService.getMemberByEmail(memberRequest.getEmail());

        if (member == null) {
            return RsData.of("400", "존재하지 않는 사용자입니다.");
        }

        if (!passwordEncoder.matches(memberRequest.getPassword(), member.getPassword())) {
            return RsData.of("400", "비밀번호가 일치하지 않습니다.");
        }

        String accessToken = jwtProvider.genAccessToken(member);
        Cookie accessTokenCookie = new Cookie("accessToken", accessToken);
        accessTokenCookie.setHttpOnly(true);
        accessTokenCookie.setSecure(true);
        accessTokenCookie.setPath("/");
        accessTokenCookie.setMaxAge(60 * 60 * 24); // 로그인 지속 시간: 24h
        res.addCookie(accessTokenCookie);

        String refreshToken = member.getRefreshToken();
        Cookie refreshTokenCookie = new Cookie("refreshToken", refreshToken);
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setSecure(true);
        refreshTokenCookie.setPath("/");
        refreshTokenCookie.setMaxAge(60 * 60 * 24); // 로그인 지속 시간: 24h
        res.addCookie(refreshTokenCookie);

        // 응답 데이터 생성
        Map<String, Object> responseData = new HashMap<>();
        responseData.put("accessToken", accessToken);
        responseData.put("refreshToken", refreshToken);
        responseData.put("user", new MemberDTO(member)); // 사용자 정보 포함

        return RsData.of("200", "토큰 발급 성공", responseData);
    }

    @GetMapping("/logout")
    public RsData logout(HttpServletResponse res, HttpServletRequest req) {
        // 쿠키 제거
        Cookie accessTokenCookie = new Cookie("accessToken", null);
        accessTokenCookie.setPath("/");
        accessTokenCookie.setMaxAge(0);
        res.addCookie(accessTokenCookie);
        Cookie refreshTokenCookie = new Cookie("refreshToken", null);
        refreshTokenCookie.setPath("/");
        refreshTokenCookie.setMaxAge(0);
        res.addCookie(refreshTokenCookie);

        // SecurityContext에서 인증 정보 제거
        SecurityContextHolder.clearContext();

        // 시큐리티 인증 정보 제거 확인
        Object securityAuthContent = SecurityContextHolder.getContext().getAuthentication();
        if (securityAuthContent != null) {
            return RsData.of("500", "로그아웃 실패: 시큐리티", securityAuthContent);
        }

        return RsData.of("200", "로그아웃 성공");
    }

    @PreAuthorize("isAuthenticated")
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

        if (member == null) {
            return RsData.of("400", "존재하지 않는 사용자입니다.");
        }
        return RsData.of("200", "내 회원정보", new MemberDTO(member));
    }

    @PreAuthorize("isAuthenticated")
    @PatchMapping("/profile")
    private RsData modifyProfile(@Valid @RequestBody MemberCreate memberCreate, Principal principal) {
        RsData checkAuthUserRD = this.checkAuthUser(
                this.memberService.getMemberByEmail(memberCreate.getEmail()),
                principal
        );
        if (checkAuthUserRD != null) return checkAuthUserRD;

        // 수정 시 필요한 필드 나열
        String email = memberCreate.getEmail();
        String newName = memberCreate.getName();
        LocalDate newBirthDate = memberCreate.getBirthDate();
        MemberGender newGender = memberCreate.getGender();

        Member member = this.memberService.getMemberByEmail(email);

        Member modifiedMember = this.memberService.modifyProfile(member, newName, newBirthDate, newGender);

        return RsData.of("200", "프로필 변경 성공", new MemberDTO(modifiedMember));
    }

    @PreAuthorize("isAuthenticated")
    @PostMapping("/profileImg/{email}")
    public RsData modifyProfileImg(@PathVariable(value = "email")String email,
                                   @RequestParam(value = "profileImg")MultipartFile image,
                                   Principal principal) {
        Member member = this.memberService.getMemberByEmail(email);

        RsData checkAuthUserRD = this.checkAuthUser(
                member,
                principal
        );
        if (checkAuthUserRD != null) return checkAuthUserRD;

        // 프로필 사진 저장
        String savedProfileImg = null;
        if (!image.isEmpty()) {
            savedProfileImg = this.imageService.saveImage("user", image);
            // 멤버 엔티티 업데이트
            member.setProfileImg(savedProfileImg);
            memberService.save(member);  // 변경사항을 데이터베이스에 저장
        } else {
            savedProfileImg = member.getProfileImg();
        }

        return RsData.of("200", "프로필 이미지 변경 성공", savedProfileImg);
    }


    @PreAuthorize("isAuthenticated()")
    @PatchMapping("/password")
    public RsData<MemberDTO> modifyPassword(@Valid @RequestBody PasswordChangeRequest request, Principal principal) {
        Member member = memberService.getMemberByEmail(principal.getName());

        // 현재 비밀번호 확인
        if (!passwordEncoder.matches(request.getCurrentPassword(), member.getPassword())) {
            return RsData.of("400", "현재 비밀번호가 일치하지 않습니다.", null);
        }

        // 비밀번호 변경 로직
        Member updatedMember = memberService.modifyPassword(principal.getName(), request.getNewPassword());

        return RsData.of("200", "비밀번호가 성공적으로 변경되었습니다.", new MemberDTO(updatedMember));
    }

    @PreAuthorize("isAuthenticated")
    @DeleteMapping("/delete/{memberId}")
    private RsData deleteMy(@PathVariable(value="memberId") Long id, Principal principal) {
        RsData checkAuthUserRD = this.checkAuthUser(
                this.memberService.getMemberById(id),
                principal
        );
        if (checkAuthUserRD != null) return checkAuthUserRD;

        return this.delete(id);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/mentor/request/{mentorId}")    // 멘티가 멘토에게 멘토링 신청
    public RsData requestMentoring(@PathVariable("mentorId")Long mentorId, Principal principal) {
        Member mentee = this.memberService.getMemberByEmail(principal.getName());
        Mentor mentor = this.mentorService.getMentorById(mentorId);

        // 사용자 검증
        RsData checkAuthUserRD = this.checkAuthUser(
                this.memberService.getMemberById(mentee.getId()),
                principal
        );
        if (checkAuthUserRD != null) return checkAuthUserRD;

        if (mentor == null){
            return RsData.of("400", "존재하는 멘토가 아닙니다.");
        }

        MentorMenteeMatching matching = this.matchingService.requestMentoring(mentee, mentor);

        return RsData.of("200", "멘토링 신청 성공", new MentorDTO(mentor));
    }

    protected RsData delete(Long id) {
        Member member = this.memberService.getMemberById(id);
        if (member == null) {
            return RsData.of("400", "이미 존재하지 않는 사용자입니다.");
        }

        this.memberService.deleteMember(member);

        Member deletedMember = this.memberService.getMemberById(id);
        if (deletedMember == null) {
            return RsData.of("200", "삭제 성공");
        } else {
            return RsData.of("500", "삭제 실패", deletedMember);
        }
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

    // 시큐리티의 로그인 정보 이용시 확인 및 예외처리
    private RsData checkAuthUser(Member member, Principal principal) {
        if (member == null) {
            return RsData.of("400", "존재하지 않는 사용자입니다.");

        } else if (principal == null) {
            return RsData.of("401", "로그아웃 상태입니다.");

        } else if (!principal.getName().equals(member.getEmail())) {
            return RsData.of("403", "권한이 없습니다.");
        }

        return null;
    }
}
