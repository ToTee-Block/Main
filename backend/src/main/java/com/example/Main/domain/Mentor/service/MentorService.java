package com.example.Main.domain.Mentor.service;

import com.example.Main.domain.Member.entity.Member;
import com.example.Main.domain.Member.enums.MemberRole;
import com.example.Main.domain.Member.repository.MemberRepository;
import com.example.Main.domain.Member.service.MemberService;
import com.example.Main.domain.Mentor.dto.MentorDTO;
import com.example.Main.domain.Mentor.entity.Mentor;
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
    private final MemberRepository memberRepository;

    public MentorDTO mentorRegistration(Member member, /*List<MentorTechStack> techStacks,*/
                                     String oneLineBio, String bio, String portfolio) {
        member.setRole(MemberRole.MENTOR);
        this.memberRepository.save(member);/*TODO: 현재는 신청만 하면 자격 부여되게 해놓음. 나중에 지워야 됨*/

        Mentor mentor = Mentor.builder()
                .member(member)
                .oneLineBio(oneLineBio)
                .bio(bio)
                .portfolio(portfolio)/*.techStacks(techStacks)*/
                .approved(true)/*테스트용으로 트루로 해둠. 원래는 false*/
                .matchingStatus(true)
                .build();
        this.mentorRepository.save(mentor);
        return new MentorDTO(mentor);
    }

    public MentorDTO getMentorInfoByMember(Member member) {
        Mentor mentor = mentorRepository.findByMember(member);
        if (mentor == null) {
            return null; // 멘토 정보가 없으면 null 반환
        }
        return new MentorDTO(mentor);
    }
}
