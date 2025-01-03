package com.example.Main.domain.Member.repository;

import com.example.Main.domain.Member.entity.Member;
import com.example.Main.domain.Member.enums.MemberRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {
    Optional<Member> findByEmail(String email);
    Optional<Member> findByRefreshToken(String refreshToken);
    Page<Member> findAll(Pageable pageable);
    List<Member> findByRole(MemberRole role);
}
