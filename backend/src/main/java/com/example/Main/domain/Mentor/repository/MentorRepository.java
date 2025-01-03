package com.example.Main.domain.Mentor.repository;

import com.example.Main.domain.Member.entity.Member;
import com.example.Main.domain.Mentor.entity.Mentor;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MentorRepository extends JpaRepository<Mentor, Long> {
    Page<Mentor> findAllByApprovedFalse(Pageable pageable);

    Page<Mentor> findAllByApprovedTrue(Pageable pageable);

    Mentor findByMember(Member member);

    @Modifying
    @Transactional
    @Query("DELETE FROM Mentor m WHERE m.id = :mentorId")
    int deleteMentorById(@Param("mentorId") Long mentorId);

    Page<Mentor> findByApprovedFalse(PageRequest pageRequest);
}
