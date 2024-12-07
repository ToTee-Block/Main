package com.example.Main.domain.Mentor.service;

import com.example.Main.domain.Member.entity.Member;
import com.example.Main.domain.Member.enums.MemberRole;
import com.example.Main.domain.Member.repository.MemberRepository;
import com.example.Main.domain.Mentor.dto.MentorDTO;
import com.example.Main.domain.Mentor.entity.Mentor;
import com.example.Main.domain.Mentor.entity.MentorMenteeMatching;
import com.example.Main.domain.Mentor.repository.MentorMenteeMatchingRepository;
import com.example.Main.domain.Mentor.repository.MentorRepository;
import com.example.Main.domain.Mentor.repository.MentorReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MentorService {
    private final MentorRepository mentorRepository;
    private final MentorReviewRepository mentorReviewRepository;
    private final MentorMenteeMatchingRepository mentorMenteeMatchingRepository;
    private final MemberRepository memberRepository;

    public MentorDTO mentorRegistration(Member member, /*List<MentorTechStack> techStacks,*/
                                        String oneLineBio, String bio, String portfolio) {

        Mentor mentor = Mentor.builder()
                .member(member)
                .oneLineBio(oneLineBio)
                .bio(bio)
                .portfolio(portfolio)/*.techStacks(techStacks)*/
                .approved(false)/* 신청할 시 멘토 리스트에 등록, but 허가되지 않음 */
                .matchingStatus(true)
                .build();
        this.mentorRepository.save(mentor);

        member.setMentorQualify(mentor);    // 멘토 정보, 개인 유저 테이블에 등록
        this.memberRepository.save(member);

        return new MentorDTO(mentor);
    }

    // 멘토 리스트 - 멘토에 이름은 올렸지만 허가(approved)가 false인 멘토만 불러옴
    public Page<Mentor> getApprovedFalse(int page) {
        if (page < 0) {
            throw new IllegalArgumentException("페이지 수는 0 이상의 값이 필요합니다.");
        }

        List<Sort.Order> sorts = new ArrayList<>();
        sorts.add(Sort.Order.desc("createdDate"));  // 작성일 기준 내림차순

        Pageable pageable = PageRequest.of(page, 10, Sort.by(sorts));

        return this.mentorRepository.findAllByApprovedFalse(pageable);
    }

    public Mentor approveMentor(Mentor mentor) {
        Member member = mentor.getMember();
        member.setRole(MemberRole.MENTOR);    // ROLE을 MENTOR로 변경
        this.memberRepository.save(member);

        mentor.setApproved(true);    // 멘토 승인상태로 변경
        mentor.setMember(member);
        this.mentorRepository.save(mentor);

        return mentor;
    }

    public void denyMentor(Mentor mentor) {
        this.mentorRepository.delete(mentor);
    }

    public Mentor getMentorById(Long id) {
        return this.mentorRepository.findById(id).orElse(null);
    }

    public MentorDTO getMentorInfoByMember(Member member) {
        Mentor mentor = mentorRepository.findByMember(member);
        if (mentor == null) {
            return null; // 멘토 정보가 없으면 null 반환
        }
        return new MentorDTO(mentor);
    }
}