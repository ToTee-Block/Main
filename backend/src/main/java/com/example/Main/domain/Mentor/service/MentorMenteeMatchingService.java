package com.example.Main.domain.Mentor.service;

import com.example.Main.domain.Member.entity.Member;
import com.example.Main.domain.Mentor.entity.Mentor;
import com.example.Main.domain.Mentor.entity.MentorMenteeMatching;
import com.example.Main.domain.Mentor.repository.MentorMenteeMatchingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class MentorMenteeMatchingService {
    private final MentorMenteeMatchingRepository matchingRepository;

// ------ MENTOR ------
    public MentorMenteeMatching requestMentoring(Member mentee, Mentor mentor) {
        MentorMenteeMatching matching = new MentorMenteeMatching(mentee, mentor, false);

        this.matchingRepository.save(matching);

        return matching;
    }

    public List<MentorMenteeMatching> myApprovedMentoringList(Mentor mentor) {
        return this.matchingRepository.findByMentorAndApprovedTrue(mentor);
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

// ------ MEMBER ------
    public List<MentorMenteeMatching> getMyMatchings(Member member) {
        return this.matchingRepository.findByMentee(member);
    }

    public List<MentorMenteeMatching> getMyApprovedMentoringList(Member member) {
        return this.matchingRepository.findByMenteeAndApprovedTrue(member);
    }

    public boolean checkMatchingExist(Member mentee, Mentor mentor) {
        List<MentorMenteeMatching> matching = this.matchingRepository.findByMenteeAndMentor(mentee, mentor);

        if (matching.size() > 0) {
            return true;
        } else {
            return false;
        }
    }

// ------ MENTOR & MEMBER ------
    public void denyMatching(MentorMenteeMatching matching) {
    this.matchingRepository.delete(matching);
}

}