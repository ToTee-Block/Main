package com.example.Main.domain.Mentor.repository;

import com.example.Main.domain.Mentor.entity.MentorReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MentorReviewRepository extends JpaRepository<MentorReview, Long> {
    // mentorId로 리뷰 리스트 조회 (JPQL 사용)
    @Query("SELECT mr FROM MentorReview mr WHERE mr.mentor.id = :mentorId")
    List<MentorReview> findReviewsByMentorId(@Param("mentorId") Long mentorId);
}
