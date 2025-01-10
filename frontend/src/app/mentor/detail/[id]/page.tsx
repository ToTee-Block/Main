"use client";

import { useState, useEffect } from "react";
import styles from "@/styles/pages/mentor/mentor-detail.module.scss";
import MentorButton from "@/components/button/MentorButton";
import EditButton from "@/components/button/EditButton";
import Tag from "@/components/tag/tag";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import axios from "axios";
import apiClient from "@/api/axiosConfig";

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
  techStacks: [];
  review: [];
  matchingStatus: boolean;
}

interface Reviews {
  content: string;
  mentorId: Number;
  reviewer: [];
}

export default function MentorDetail() {
  const [mentor, setMentor] = useState<MentorData | null>(null);
  const [reviews, setReviews] = useState<Reviews[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  useEffect(() => {
    const fetch = async () => {
      if (id && typeof id === "string") {
        const mentorId = await fetchMentorData(id);
        fetchReviews(mentorId);
      }
    };

    fetch();
  }, [id]);

  const fetchMentorData = async (memberID: string) => {
    try {
      const response = await axios.get(
        `http://localhost:8081/api/v1/mentors/profile/${memberID}`
      );
      console.log(response);
      const resultCode = response.data.resultCode;
      const data = response.data.data;
      if (resultCode === "200") {
        setMentor(data);
      } else {
        setError(response.data.msg);
      }

      return data.id;
    } catch (err) {
      setError("멘토 데이터를 가져오는 중 오류가 발생했습니다");
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async (mentorId: string) => {
    try {
      const response = await axios.get(
        `http://localhost:8081/api/v1/reviews/${mentorId}`
      );
      console.log(response);
      const resultCode = response.data.resultCode;
      const data = response.data.data;
      console.log(data);
      if (resultCode === "200") {
        setReviews(data);
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

  const handleRequestMentoring = async () => {
    console.log("??");
    try {
      const response = await apiClient.get(
        `/api/v1/members/mentor/request/${mentor?.id}`
      );
      console.log(response);
      const resultCode = response.data.resultCode;
      const msg = response.data.msg;
      const data = response.data.data;
      console.log(data);
      if (resultCode === "200") {
        alert(msg);
      } else {
        alert(msg);
      }
    } catch (err) {
      alert(err);
    }
  };

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
              <div className={styles.starNumber}>{mentor.id}</div>
            </div>
          </div>
          <div className={styles.contentWrapper} />
          <div className={styles.image}>
            <img
              src={
                mentor.profileImg
                  ? `/uploaded/${mentor.profileImg}`
                  : "/icon/user.svg"
              }
              alt={mentor.name}
            />
          </div>
          <div className={styles.dividerLine} />
          <div className={styles.info}>
            <span className={styles.name}>{mentor.name}</span>
            <span className={styles.role}>{mentor.oneLineBio}</span>
          </div>
        </div>
        <div className={styles.status}>
          <MentorButton
            onClick={() => {
              handleRequestMentoring();
            }}
          >
            Mentor 신청
          </MentorButton>
        </div>
      </div>

      <div className={styles.content}>
        <h1 className={styles.title}>HELLO EVERYONE</h1>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>자기소개</h2>
          <p className={styles.description}>{mentor.bio}</p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>기술스택</h2>
          <Tag
            tags={mentor?.techStacks}
            selectedTags={mentor?.techStacks}
            onTagToggle={null}
          />
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>포트폴리오 주소</h2>
          <a
            href={mentor.portfolio}
            target="_blank"
            className={styles.portfolioLink}
          >
            {mentor.portfolio}
          </a>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>후기</h2>
          <div className={styles.review}>
            {reviews?.map((review, index) => (
              <div key={index} className={styles.reviewItem}>
                <div className={styles.profile}>
                  <div className={styles.imgBox}>
                    <img
                      src={
                        review.reviewer.profileImg
                          ? `/uploaded/${review.reviewer.profileImg}`
                          : "/icon/user.svg"
                      }
                      alt="기본 프로필 이미지"
                    />
                  </div>
                  <p>{review.reviewer.name}</p>
                </div>
                <div className={styles.content}>
                  <pre>{review.content}</pre>
                </div>
              </div>
            ))}
          </div>
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
