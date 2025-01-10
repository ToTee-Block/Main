"use client";

import React, { useEffect, useState } from "react";
import styles from "@/styles/pages/mentor/mentor-form.module.scss";
import apiClient from "@/api/axiosConfig";
import Image from "next/image";
import ApplyButton from "@/components/button/ApplyButton";
import Tag from "@/components/tag/tag";

interface MentorData {
  id: string;
  oneLineBio?: string;
  bio?: string;
  portfolio?: string;
  techStacks?: string[];
  approved?: boolean;
  profileImg?: string;
}

export default function MentorForm() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isApplyDisabled, setIsApplyDisabled] = useState(false);
  const [oneLineBio, setOneLineBio] = useState("");
  const [bio, setBio] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [mentorStatus, setMentorStatus] = useState<string | null>(null);
  const [techTags, setTechTags] = useState<string[]>([]);

  useEffect(() => {
    const checkLoginAndMentorStatus = async () => {
      try {
        const memberResponse = await apiClient.get("/api/v1/members/me");
        if (memberResponse.data.resultCode === "200") {
          setIsLoggedIn(true);
          if (memberResponse.data.data.profileImg) {
            setProfileImage(memberResponse.data.data.profileImg);
          }

          const memberId = String(memberResponse.data.data.id); 
          const mentorResponse = await apiClient.get(`/api/v1/mentors/profile/${memberId}`);
          console.log("멘토 응답:", mentorResponse.data);

          if (mentorResponse.data.resultCode === "200" && mentorResponse.data.data) {
            const mentorData: MentorData = {
              ...mentorResponse.data.data,
              id: String(mentorResponse.data.data.id) // id를 string으로 변환
            };
            console.log("멘토 데이터:", mentorData);

            if (mentorData.approved === true) {
              const mentorId = mentorData.id;
              window.location.href = ("/mentor/detail/" + mentorId);
              return;
            }

            setOneLineBio(mentorData.oneLineBio || "");
            setBio(mentorData.bio || "");
            setPortfolio(mentorData.portfolio || "");
            if (Array.isArray(mentorData.techStacks)) {
              setSelectedTags(mentorData.techStacks);
            }
            setMentorStatus("pending");
          }
        }
      } catch (error: any) {
        if (error.response?.status === 401) {
          setIsLoggedIn(false);
        }
      }
    };

    const fetchTechStacks = async () => {
      try {
        const response = await apiClient.get("/api/v1/techStacks");
        if (response.data.resultCode === "200") {
          setTechTags(response.data.data);
        } else {
          throw new Error("Failed to fetch tech stacks");
        }
      } catch (error) {
        console.error("Error fetching tech stacks:", error);
      }
    };

    checkLoginAndMentorStatus();
    fetchTechStacks();
  }, []);

  const handleTagToggle = (tagName: string): void => {
    if (!isLoggedIn) {
      alert("로그인이 필요한 서비스입니다.");
      window.location.href = "/members";
      return;
    }
    if (mentorStatus === "pending") return;

    setSelectedTags((prev) => {
      const updatedTags = prev.includes(tagName)
        ? prev.filter((item) => item !== tagName)
        : [...prev, tagName];

      return updatedTags;
    });
  };

  const handleApplyClick = async () => {
    if (!isLoggedIn) {
      alert("로그인이 필요한 서비스입니다.");
      window.location.href = "/members";
      return;
    }

    if (!oneLineBio.trim() || !bio.trim() || !portfolio.trim() || selectedTags.length === 0) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    try {
      const response = await apiClient.post("/api/v1/mentors/registration", {
        oneLineBio: oneLineBio.trim(),
        bio: bio.trim(),
        portfolio: portfolio.trim(),
        techStacks: selectedTags
      });

      if (response.data.resultCode === "200") {
        alert("멘토 등록 신청이 성공적으로 접수되었습니다.");
        setMentorStatus("pending");
        window.location.reload();
      } else {
        throw new Error(response.data.msg || "멘토 등록 신청에 실패했습니다.");
      }
    } catch (error: any) {
      console.error("Error applying for mentor:", error);
      setErrorMessage(error.message || "멘토 등록 신청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      setIsApplyDisabled(false);
    }
  };

  const autoResize = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = event.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleSection}>
        <h1 className={styles.title}>Mentor profile</h1>
        <div className={styles.divider} />
      </div>

      <div className={styles.profileContainer}>
        <div className={styles.imageWrapper}>
          <Image
            src={profileImage ? `/uploaded/${profileImage}` : "/icon/user.svg"}
            alt="Profile"
            width={80}
            height={80}
            className={styles.profileImage}
          />
        </div>
        <input
          type="text"
          value={oneLineBio}
          onChange={(e) => {
            if (!isLoggedIn) {
              alert("로그인이 필요한 서비스입니다.");
              window.location.href = "/members";
              return;
            }
            setOneLineBio(e.target.value);
          }}
          placeholder="한줄 소개를 입력해주세요."
          className={styles.imageGuide}
          disabled={mentorStatus === "pending"}
        />
      </div>

      <div className={styles.formBox}>
        <h3 className={styles.boxTitle}>자기소개</h3>
        <textarea
          className={styles.textarea}
          placeholder="입력해주세요."
          value={bio}
          onChange={(e) => {
            if (!isLoggedIn) {
              alert("로그인이 필요한 서비스입니다.");
              window.location.href = "/members";
              return;
            }
            setBio(e.target.value);
            autoResize(e);
          }}
          onInput={autoResize}
          disabled={mentorStatus === "pending"}
        />
      </div>

      <div className={`${styles.formBox} ${styles.techStackBox}`}>
        <h3 className={styles.boxTitle}>기술 스택</h3>
        <Tag
          tags={techTags || []}
          selectedTags={selectedTags}
          onTagToggle={handleTagToggle}
          disabled={mentorStatus === "pending"}
        />
      </div>

      <div className={styles.formBox}>
        <h3 className={styles.boxTitle}>포트폴리오 주소</h3>
        <input
          type="text"
          className={styles.input}
          placeholder="입력해주세요."
          value={portfolio}
          onChange={(e) => {
            if (!isLoggedIn) {
              alert("로그인이 필요한 서비스입니다.");
              window.location.href = "/members";
              return;
            }
            setPortfolio(e.target.value);
          }}
          disabled={mentorStatus === "pending"}
        />
      </div>

      {errorMessage && (
        <div className={styles.errorMessage}>{errorMessage}</div>
      )}

      {mentorStatus === "pending" && (
        <div className={styles.pendingMessage}>
          현재 멘토 신청이 검토 중입니다. 관리자 승인 후 멘토로 활동하실 수 있습니다.
        </div>
      )}

      <div className={styles.buttonWrapper}>
        <div className={styles.submitButton}>
          <ApplyButton
            onClick={handleApplyClick}
            disabled={mentorStatus === "pending"}
          >
            {mentorStatus === 'pending' ? '심사중' : '신청'}
          </ApplyButton>
        </div>
      </div>
    </div>
  );
}