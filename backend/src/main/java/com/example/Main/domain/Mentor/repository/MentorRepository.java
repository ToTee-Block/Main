package com.example.Main.domain.Mentor.repository;

import com.example.Main.domain.Member.entity.Member;
import com.example.Main.domain.Mentor.entity.Mentor;
import com.example.Main.domain.Post.entity.Post;
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

    // 멘토 이름, 한 줄 소개로 검색하는 메소드
    @Query("SELECT m FROM Mentor m JOIN m.member mem WHERE " +
            "(LOWER(m.bio) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(mem.name) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "AND m.approved = true " +
            "ORDER BY m.createdDate DESC")
    Page<Mentor> searchRecentMentors(@Param("keyword") String keyword, Pageable pageable);

    // 내 멘토검색
    @Query("SELECT m FROM Mentor m " +
            "JOIN m.myMentees mm " +
            "JOIN m.member member " +
            "WHERE mm.mentee = :mentee " +
            "AND m.approved = true " +  // 멘토는 승인된 상태
            "AND mm.approved = true " +  // 멘티와의 매칭도 승인된 상태
            "AND (member.name LIKE %:keyword% OR m.bio LIKE %:keyword%) " +
            "ORDER BY m.createdDate DESC")
    Page<Mentor> getMyMentors(@Param("mentee") Member mentee,
                              @Param("keyword") String keyword,
                              Pageable pageable);


    Mentor findByMember(Member member);

    @Modifying
    @Transactional
    @Query("DELETE FROM Mentor m WHERE m.id = :mentorId")
    int deleteMentorById(@Param("mentorId") Long mentorId);

    Page<Mentor> findByApprovedFalse(PageRequest pageRequest);
}
