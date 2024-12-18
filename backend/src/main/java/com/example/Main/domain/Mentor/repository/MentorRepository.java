package com.example.Main.domain.Mentor.repository;

import com.example.Main.domain.Member.entity.Member;
import com.example.Main.domain.Mentor.entity.Mentor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MentorRepository extends JpaRepository<Mentor, Long> {
    Page<Mentor> findAllByApprovedFalse(Pageable pageable);

    Mentor findByMember(Member member);
}
