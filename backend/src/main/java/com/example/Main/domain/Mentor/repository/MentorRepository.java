package com.example.Main.domain.Mentor.repository;

import com.example.Main.domain.Mentor.entity.Mentor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MentorRepository extends JpaRepository<Mentor, Long> {
}
