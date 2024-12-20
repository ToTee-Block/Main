"use client";

import { useState, useEffect } from "react";
import styles from "@/styles/pages/mentor/mentor-detail.module.scss";
import apiClient from "@/api/axiosConfig";
import Image from "next/image";
import MentorButton from "@/components/button/MentorButton";
import EditButton from "@/components/button/EditButton";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

interface MentorData {
  id: number;
  email: string;
  name: string;
  profileImg: string | null;
  createdDate: string;
  modifiedDate: string;
  oneLineBio: string;
  bio: string;
  portfolio: string;
  approved: boolean;
  matchingStatus: boolean;
}

export default function MentorDetail() {
  const [mentor, setMentor] = useState<MentorData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  useEffect(() => {
    if (id && typeof id === "string") {
      fetchMentorData(id);
    }
  }, [id]);

  const fetchMentorData = async (mentorId: string) => {
    try {
      const response = await apiClient.get(
        `/api/v1/mentors/profile/${mentorId}`
      );
      if (response.data.resultCode === "200") {
        setMentor(response.data.data);
      } else {
        setError(response.data.msg);
      }
    } catch (err) {
      setError("멘토 데이터를 가져오는 중 오류가 발생했습니다");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>오류: {error}</div>;
  if (!mentor) return <div>멘토 데이터를 찾을 수 없습니다</div>;

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
          <div className={styles.image}>
            {mentor.profileImg && (
              <Image
                src={mentor.profileImg}
                alt={mentor.name}
                layout="fill"
                objectFit="cover"
              />
            )}
          </div>
          <div className={styles.dividerLine} />
          <div className={styles.info}>
            <span className={styles.name}>{mentor.name}</span>
            <span className={styles.role}>{mentor.oneLineBio}</span>
          </div>
        </div>
        <div className={styles.status}>
          <MentorButton>Mentor 신청</MentorButton>
        </div>
      </div>

      <div className={styles.content}>
        <h1 className={styles.title}>HELLO EVERYONE</h1>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>자기소개</h2>
          <p className={styles.description}>{mentor.bio}</p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>포트폴리오 주소</h2>
          <a href={mentor.portfolio} className={styles.portfolioLink}>
            {mentor.portfolio}
          </a>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>추가 정보</h2>
          <p>이메일: {mentor.email}</p>
          <p>승인 상태: {mentor.approved ? "승인됨" : "승인 대기 중"}</p>
          <p>매칭 상태: {mentor.matchingStatus ? "매칭 중" : "매칭 가능"}</p>
          <p>생성일: {new Date(mentor.createdDate).toLocaleDateString()}</p>
          <p>수정일: {new Date(mentor.modifiedDate).toLocaleDateString()}</p>
        </div>
      </div>

      <div className={styles.editButtonWrapper}>
        <div className={styles.submitButton}>
          <EditButton onClick={() => router.push(`/mentor/edit/${mentor.id}`)}>
            수정
          </EditButton>
        </div>
      </div>
    </div>
  );
}
