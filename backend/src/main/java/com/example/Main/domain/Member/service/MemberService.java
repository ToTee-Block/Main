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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MemberService {
    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    public MemberDTO join(String email, String password, String name, LocalDate birthDate, MemberGender gender, String profileImg, MemberRole role) {
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

    public Member modifyProfile(Member member, String newPassword, String newName, LocalDate newBirthDate, MemberGender newGender, String profileImg) {
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

    public void deleteMember(Member member) {
        this.memberRepository.delete(member);
    }

    public Page<Member> getList(int page) {
        if (page < 0) {
            throw new IllegalArgumentException("페이지 수는 0 이상의 값이 필요합니다.");
        }

        List<Sort.Order> sorts = new ArrayList<>();
        sorts.add(Sort.Order.desc("createdDate"));  // 작성일 기준 내림차순

        Pageable pageable = PageRequest.of(page, 10, Sort.by(sorts));

        return this.memberRepository.findAll(pageable);
    }

    public Member getMemberById(Long id) {
        return this.memberRepository.findById(id).orElse(null);
    }

    public Member getMemberByEmail(String email) {
        return this.memberRepository.findByEmail(email).orElse(null);
    }


//    ------- TOKEN -------
    public boolean validateToken(String accessToken) {
        return jwtProvider.verify(accessToken);
    }

    public RsData<String> refreshAccessToken(String refreshToken) {
        Member member = memberRepository.findByRefreshToken(refreshToken).orElseThrow(() -> new RuntimeException("존재하지 않는 리프레시 토큰입니다."));

        String accessToken = jwtProvider.genAccessToken(member);

        return RsData.of("200", "토큰 갱신 성공", accessToken);
    }

    public SecurityMember getUserFromAccessToken(String accessToken) {
        // JWT의 payload를 가져옴
        Map<String, Object> payloadBody = jwtProvider.getClaims(accessToken);

        // 필수 데이터 검증
        if (!payloadBody.containsKey("id") || !payloadBody.containsKey("email")) {
            throw new IllegalArgumentException("JWT 토큰에 필수 정보가 누락되었습니다.");
        }

        long id = Long.parseLong(payloadBody.get("id").toString());
        String email = (String) payloadBody.get("email");

        // 권한 정보 처리
        String rules = (String) payloadBody.getOrDefault("rules", "ROLE_USER"); // 기본값 "ROLE_USER"
        if (rules == null || rules.isBlank()) {
            rules = "ROLE_USER"; // 권한 정보가 없을 경우 기본값 설정
        }

        // 권한을 리스트로 변환
        List<GrantedAuthority> authorities = Arrays.stream(rules.split(","))
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());

        // SecurityMember 객체 생성 후 반환
        return new SecurityMember(id, email, "", authorities);
    }
}