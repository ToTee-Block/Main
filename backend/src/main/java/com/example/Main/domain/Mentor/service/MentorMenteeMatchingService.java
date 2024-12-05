package com.example.Main.domain.Mentor.service;

import com.example.Main.domain.Member.entity.Member;
import com.example.Main.domain.Mentor.entity.Mentor;
import com.example.Main.domain.Mentor.entity.MentorMenteeMatching;
import com.example.Main.domain.Mentor.repository.MentorMenteeMatchingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MentorMenteeMatchingService {
    private final MentorMenteeMatchingRepository matchingRepository;


    public MentorMenteeMatching requestMentoring(Member mentee, Mentor mentor) {
        MentorMenteeMatching matching = new MentorMenteeMatching(mentee, mentor, false);

        this.matchingRepository.save(matching);

        return matching;
    }

    public List<MentorMenteeMatching> myMentoringRequestList() {
        return this.matchingRepository.findAll();
    }

    public List<MentorMenteeMatching> myMentoringList(Mentor mentor) {
        return this.matchingRepository.findByMentor(mentor);
    }

    public MentorMenteeMatching getMatchingById(Long id) {
        return this.matchingRepository.findById(id).orElse(null);
    }

    public void approveMatching(MentorMenteeMatching matching) {
        matching.setApproved(true);
        this.matchingRepository.save(matching);
    }

    public void denyMatching(MentorMenteeMatching matching) {
        this.matchingRepository.delete(matching);
    }
}