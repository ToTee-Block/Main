package com.example.Main.domain.Member.service;

import com.example.Main.domain.Member.dto.MemberDTO;
import com.example.Main.domain.Member.entity.Member;
import com.example.Main.domain.Member.enums.MemberGender;
import com.example.Main.domain.Member.repository.MemberRepository;
import com.example.Main.domain.Member.enums.MemberRole;
import com.example.Main.global.Jwt.JwtProvider;
import com.example.Main.global.RsData.RsData;
import com.example.Main.global.Security.SecurityMember;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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

    public MemberDTO join(String username, String password, LocalDateTime birthDate, MemberGender gender) {
        if (this.memberRepository.findByUsername(username).isPresent()) {
            return null;
        }

        Member member = Member.builder()
                .username(username)
                .password(this.passwordEncoder.encode(password))
                .birthDate(birthDate)
                .gender(gender)
                .role(MemberRole.USER)
                .build();

        String refreshToken = jwtProvider.genRefreshToken(member);
        member.setRefreshToken(refreshToken);

        this.memberRepository.save(member);

        return new MemberDTO(member);
    }

    public Member getMemberByName(String username) {
        Optional<Member> member = this.memberRepository.findByUsername(username);
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
        String username = (String) payloadBody.get("username");
        List<GrantedAuthority> authorities = new ArrayList<>();

        return new SecurityMember(id, username, "", authorities);
    }
}
