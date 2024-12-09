"use client";

import React, { useState, useEffect } from "react";
import apiClient from "@/api/axiosConfig";
import styles from "@/styles/pages/mentor-detail.module.scss";
import MentorApplyButton from "@/components/button/MentorApplyButton";
import EditButton from "@/components/button/EditButton";
import { useParams } from "next/navigation";

interface MentorProfile {
  id: number;
  name: string;
  role: string;
  oneLineBio: string;
  bio: string;
  portfolio: string;
  skills: string[];
  reviews: string[];
}

export default function MentorDetail() {
  const [mentorData, setMentorData] = useState<MentorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();

  useEffect(() => {
    const fetchMentorProfile = async () => {
      try {
        const response = await apiClient.get(
          `/api/v1/mentors/profile/${params.id}`
        );
        if (response.data.resultCode === "200") {
          setMentorData(response.data.data);
        } else {
          setError(response.data.msg);
        }
      } catch (err) {
        setError("멘토 정보를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchMentorProfile();
    } else {
      setError("유효하지 않은 멘토 ID입니다.");
      setLoading(false);
    }
  }, [params.id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!mentorData) return <div>멘토 정보를 찾을 수 없습니다.</div>;

  return (
    <div className={styles.mentorDetail}>
      <div className={styles.titleSection}>
        <h1 className={styles.title}>Mentor profile</h1>
        <div className={styles.divider} />
      </div>

      <div className={styles.cardContainer}>
        <div className={styles.card}>
          <div className={styles.starWrapper}>
            <div className={styles.starContainer}>
              <img src="/icon/star1.svg" alt="star icon" />
              <div className={styles.starNumber}>01</div>
            </div>
          </div>
          <div className={styles.contentWrapper} />
          <div className={styles.image} />
          <div className={styles.dividerLine} />
          <div className={styles.info}>
            <span className={styles.name}>{mentorData.name}</span>
            <span className={styles.role}>{mentorData.role}</span>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <h1 className={styles.title}>HELLO EVERYONE</h1>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>자기소개</h2>
          <p className={styles.description}>{mentorData.bio}</p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>기술 스택</h2>
          <div className={styles.skillTags}>
            {mentorData.skills?.map((skill, index) => (
              <span key={index} className={styles.tag}>
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>포트폴리오 주소</h2>
          <a href={mentorData.portfolio} className={styles.portfolioLink}>
            {mentorData.portfolio}
          </a>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>멘티 후기's</h2>
          <div className={styles.history}>
            {mentorData.reviews?.map((review, index) => (
              <div key={index} className={styles.historyItem}>
                {review}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.editButtonWrapper}>
        <div className={styles.submitButton}>
          <EditButton>수정</EditButton>
        </div>
      </div>
    </div>
  );
}
