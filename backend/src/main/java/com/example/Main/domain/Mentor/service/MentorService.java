package com.example.Main.domain.Mentor.service;

import com.example.Main.domain.Mentor.repository.MentorMenteeMatchingRepository;
import com.example.Main.domain.Mentor.repository.MentorRepository;
import com.example.Main.domain.Mentor.repository.MentorReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MentorService {
    private final MentorRepository mentorRepository;
    private final MentorReviewRepository mentorReviewRepository;
    private final MentorMenteeMatchingRepository mentorMenteeMatchingRepository;
}
