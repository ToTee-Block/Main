"use client";

import React, { useEffect, useState } from "react";
import styles from "@/styles/pages/mentor/mentor-form.module.scss";
import apiClient from "@/api/axiosConfig";
import Image from "next/image";
import ApplyButton from "@/components/button/ApplyButton";
import Tag from "@/components/tag/tag";

export default function MentorForm() {
  const [isApplyDisabled, setIsApplyDisabled] = useState(false);
  const [oneLineBio, setOneLineBio] = useState("");
  const [bio, setBio] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [mentorStatus, setMentorStatus] = useState<string | null>(null);

  useEffect(() => {
    const checkLoginAndMentorStatus = async () => {
      try {
        // 로그인 상태 확인 및 프로필 이미지 가져오기
        const memberResponse = await apiClient.get("/api/v1/members/me");
        if (memberResponse.data.resultCode === "200") {
          if (memberResponse.data.data.profileImg) {
            setProfileImage(memberResponse.data.data.profileImg);
          }

          try {
            // 멘토 상태 확인
            const mentorResponse = await apiClient.get(`/api/v1/mentors/${memberResponse.data.data.id}`);
            if (mentorResponse.data.resultCode === "200") {
              if (mentorResponse.data.data.approve === true) {
                window.location.href = "/mentor/detail";
                return;
              }
              // 승인 대기중인 경우
              setMentorStatus("pending");
              setIsApplyDisabled(true);
            }
          } catch {
            // 멘토 데이터가 없는 경우 (신규 신청 가능)
            setMentorStatus(null);
            setIsApplyDisabled(false);
          }
        } else {
          // 로그인되지 않은 경우
          window.location.href = "/login";
        }
      } catch {
        // 로그인되지 않은 경우
        window.location.href = "/login";
      }
    };

    checkLoginAndMentorStatus();
  }, []);

  const techTags = [
    "JavaScript",
    "TypeScript",
    "React",
    "Vue",
    "Angular",
    "Node.js",
    "Python",
    "Java",
    "Spring",
    "C++",
    "C#",
    "PHP",
    "Ruby",
    "Swift",
    "Kotlin",
    "Go"
  ];

  const handleTagToggle = (tagName: string): void => {
    if (mentorStatus === "pending") return;

    setSelectedTags((prev) => {
      if (prev.includes(tagName)) {
        return prev.filter((item) => item !== tagName);
      } else {
        return [...prev, tagName];
      }
    });
  };


 const handleApplyClick = async () => {
    setIsApplyDisabled(true);
    setErrorMessage("");
    try {
      const selectedTechStacks = selectedTags
        .map((selected, index) => selected ? techTags[index] : null)
        .filter((tag): tag is string => tag !== null);

      const response = await apiClient.post("/api/v1/mentors/registration", {
        oneLineBio,
        bio,
        portfolio,
        techStacks: selectedTechStacks
      });

      if (response.data.resultCode === "200") {
        alert("멘토 등록 신청이 성공적으로 접수되었습니다.");
        setMentorStatus("pending");
        setIsApplyDisabled(true);

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

const isFieldDisabled = mentorStatus === "pending";

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
          onChange={(e) => setOneLineBio(e.target.value)}
          placeholder="한줄 소개를 입력해주세요."
          className={styles.imageGuide}
        />
      </div>

      <div className={styles.formBox}>
        <h3 className={styles.boxTitle}>자기소개</h3>
        <textarea
          className={styles.textarea}
          placeholder="입력해주세요."
          value={bio}
          onChange={(e) => {
          setBio(e.target.value);
          autoResize(e);
        }}
        onInput={autoResize} 
      />
      </div>

      <div className={`${styles.formBox} ${styles.techStackBox}`}>
        <h3 className={styles.boxTitle}>기술 스택</h3>
        <Tag
          tags={techTags}
          selectedTags={selectedTags}
          onTagToggle={handleTagToggle}
        />
      </div>

      <div className={styles.formBox}>
        <h3 className={styles.boxTitle}>포트폴리오 주소</h3>
        <input
          type="text"
          className={styles.input}
          placeholder="입력해주세요."
          value={portfolio}
          onChange={(e) => setPortfolio(e.target.value)}
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
            disabled={isApplyDisabled}
          >
            {mentorStatus === 'pending' ? '심사중' : '신청'}
          </ApplyButton>
        </div>
      </div>
    </div>
  );
}
