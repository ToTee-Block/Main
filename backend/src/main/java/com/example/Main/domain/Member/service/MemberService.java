package com.example.Main.domain.Member.service;

import com.example.Main.domain.Chat.serivce.ChatService;
import com.example.Main.domain.Member.dto.MemberDTO;
import com.example.Main.domain.Member.entity.Member;
import com.example.Main.domain.Member.enums.MemberGender;
import com.example.Main.domain.Member.repository.MemberRepository;
import com.example.Main.domain.Member.enums.MemberRole;
import com.example.Main.global.Jwt.JwtProvider;
import com.example.Main.global.RsData.RsData;
import com.example.Main.global.Security.SecurityMember;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
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

    public Member modifyProfile(Member member, String newName, LocalDate newBirthDate, MemberGender newGender) {
        member.setName(newName);
        member.setBirthDate(newBirthDate);
        member.setGender(newGender);

        this.memberRepository.save(member);

        return member;
    }

    public Member modifyPassword(String email, String newPassword) {
        Member member = this.getMemberByEmail(email);
        member.setPassword(this.passwordEncoder.encode(newPassword));

        this.memberRepository.save(member);

        return member;
    }

    @Transactional
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
        Map<String, Object> payloadBody = jwtProvider.getClaims(accessToken);

        long id = (int) payloadBody.get("id");
        String email = (String) payloadBody.get("email");
        String rules = (String) payloadBody.get("rules");  // "ROLE_USER,ROLE_ADMIN" 형태일 수 있음
        List<GrantedAuthority> authorities = Arrays.stream(rules.split(","))
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());

        return new SecurityMember(id, email, "", authorities,null);
    }

    @Transactional
    public Member save(Member member) {
        if (member == null) {
            throw new IllegalArgumentException("Member cannot be null");
        }
        return memberRepository.save(member);
    }

    public Page<MemberDTO> getMemberList(int page) {
        if (page < 0) {
            throw new IllegalArgumentException("페이지 수는 0 이상의 값이 필요합니다.");
        }

        Pageable pageable = PageRequest.of(page, 10, Sort.by(Sort.Order.desc("createdDate")));
        Page<Member> members = this.memberRepository.findAll(pageable);

        return members.map(MemberDTO::new);
    }

    public Member getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return memberRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }
}