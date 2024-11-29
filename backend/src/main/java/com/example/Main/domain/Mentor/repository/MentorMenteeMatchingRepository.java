package com.example.Main.domain.Mentor.repository;

import com.example.Main.domain.Mentor.entity.MentorMenteeMatching;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MentorMenteeMatchingRepository extends JpaRepository<MentorMenteeMatching, Long> {
}
