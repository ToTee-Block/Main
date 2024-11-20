package com.example.Main.domain.Member.service;

import com.example.Main.domain.Member.dto.MemberDTO;
import com.example.Main.domain.Member.entity.Member;
import com.example.Main.domain.Member.enums.MemberGender;
import com.example.Main.domain.Member.repository.MemberRepository;
import com.example.Main.domain.Member.enums.MemberRole;
import com.example.Main.global.Jwt.JwtProvider;
import com.example.Main.global.RsData.RsData;
import com.example.Main.global.Security.SecurityMember;
import com.example.Main.global.Util.Service.ImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MemberService {
    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    public MemberDTO join(String email, String password, String name, LocalDateTime birthDate, MemberGender gender, String profileImg, MemberRole role) {
        if (this.memberRepository.findByEmail(email).isPresent()) {
            return null;
        }

        Member member = Member.builder()
                .email(email)
                .password(this.passwordEncoder.encode(password))
                .name(name)
                .birthDate(birthDate)
                .gender(gender)
                .profileImg(profileImg)
                .role(role)
                .build();

        String refreshToken = jwtProvider.genRefreshToken(member);
        member.setRefreshToken(refreshToken);

        this.memberRepository.save(member);

        return new MemberDTO(member);
    }

    public Member modifyProfile(Member member, String newPassword, String newName, LocalDateTime newBirthDate, MemberGender newGender, String profileImg) {
        member.setPassword(newPassword);
        member.setName(newName);
        member.setBirthDate(newBirthDate);
        member.setGender(newGender);
        member.setProfileImg(profileImg);

        this.memberRepository.save(member);

        return member;
    }

    public Member modifyPassword(String email, String newPassword) {
        Member member = this.getMemberByEmail(email);
        member.setPassword(this.passwordEncoder.encode(newPassword));

        this.memberRepository.save(member);

        return member;
    }

    public Member getMemberByEmail(String email) {
        Optional<Member> member = this.memberRepository.findByEmail(email);
        if (member.isEmpty()) {
            return null;
        }
        return member.get();
    }

    public boolean validateToken(String accessToken) {
        return jwtProvider.verify(accessToken);
    }

    public RsData<String> refreshAccessToken(String refreshToken) {
        Member member = memberRepository.findByRefreshToken(refreshToken).orElseThrow(() -> new RuntimeException("존재하지 않는 리프레시 토큰입니다."));

        String accessToken = jwtProvider.genAccessToken(member);

        return RsData.of("200", "토큰 갱신 성공", accessToken);
    }

    public SecurityMember getUserFromAccessToken(String accessToken) {
        Map<String, Object> payloadBody = jwtProvider.getClaims(accessToken);

        long id = (int) payloadBody.get("id");
        String email = (String) payloadBody.get("email");
        List<GrantedAuthority> authorities = new ArrayList<>();

        return new SecurityMember(id, email, "", authorities);
    }
}
