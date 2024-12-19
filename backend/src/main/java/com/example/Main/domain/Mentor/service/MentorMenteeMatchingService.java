package com.example.Main.domain.Mentor.service;

import com.example.Main.domain.Member.entity.Member;
import com.example.Main.domain.Mentor.entity.Mentor;
import com.example.Main.domain.Mentor.entity.MentorMenteeMatching;
import com.example.Main.domain.Mentor.repository.MentorMenteeMatchingRepository;
import com.example.Main.domain.notification.service.NotificationService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MentorMenteeMatchingService {
    private final MentorMenteeMatchingRepository matchingRepository;
    private final NotificationService notificationService;

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

    // 멘토 매칭 삭제
    @Transactional
    public void deleteMatching(MentorMenteeMatching matching) {
        matchingRepository.delete(matching);

        notificationService.sendNotification(matching.getMentor().getMember().getId().toString(),
                matching.getMentee().getName() + "님과 멘토링 관계가 종료되었습니다.");
        notificationService.sendNotification(matching.getMentee().getId().toString(),
                matching.getMentor().getMember().getName() + "님과 멘토링 관계가 종료되었습니다.");
    }

    public MentorMenteeMatching getMatchingByMentorAndMenteeId(Long mentorId, Long menteeId) {
        return matchingRepository.findByMentor_IdAndMentee_Id(mentorId, menteeId)
                .orElse(null);
    }
}