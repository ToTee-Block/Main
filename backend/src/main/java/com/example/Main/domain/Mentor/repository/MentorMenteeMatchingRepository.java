package com.example.Main.domain.Mentor.repository;

import com.example.Main.domain.Member.entity.Member;
import com.example.Main.domain.Mentor.entity.Mentor;
import com.example.Main.domain.Mentor.entity.MentorMenteeMatching;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MentorMenteeMatchingRepository extends JpaRepository<MentorMenteeMatching, Long> {
    List<MentorMenteeMatching> findByMentor(Mentor mentor);

    List<MentorMenteeMatching> findByMentorAndApprovedTrue(Mentor mentor);

    List<MentorMenteeMatching> findByMentee(Member mentee);

    List<MentorMenteeMatching> findByMenteeAndApprovedTrue(Member mentee);

    List<MentorMenteeMatching> findByMenteeAndMentor(Member mentee, Mentor mentor);
}
