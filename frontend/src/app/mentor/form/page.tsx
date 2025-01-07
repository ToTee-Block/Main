"use client";

import React, { useEffect, useState } from "react";
import styles from "@/styles/pages/mentor/mentor-form.module.scss";
import apiClient from "@/api/axiosConfig";
import Image from "next/image";
import ApplyButton from "@/components/button/ApplyButton";
import Tag from "@/components/tag/tag";
import { redirect } from "next/navigation";


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
    const checkMentorStatus = async () => {
      try {
        const memberResponse = await apiClient.get("/api/v1/members/me");
        if (memberResponse.data.resultCode === "200" && memberResponse.data.data.profileImg) {
          setProfileImage(memberResponse.data.data.profileImg);
        }
    
        const mentorResponse = await apiClient.get("/api/v1/mentors/me");
        if (mentorResponse.data.resultCode === "200") {
          const status = mentorResponse.data.data.status;
          setMentorStatus(status);
          
          if (status === 'ACCEPTED') {
            redirect("/mentor/detail");
          } else if (status === 'PENDING') {
            setIsApplyDisabled(true);
          }
        }
      } catch (error) {
        // 신청 이력이 없는 경우
        setMentorStatus(null);
      }
    };

    checkMentorStatus();
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
        router.push("/");  // 신청 후 메인 페이지로 이동
      } else {
        setErrorMessage(response.data.msg || "멘토 등록 신청에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error applying for mentor:", error);
      setErrorMessage("멘토 등록 신청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsApplyDisabled(false);
    }
  };

  const autoResize = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
  const textarea = event.target;
  textarea.style.height = 'auto';  // 높이를 초기화
  textarea.style.height = `${textarea.scrollHeight}px`;  // 스크롤 높이만큼 설정
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

      <div className={styles.buttonWrapper}>
        <div className={styles.submitButton}>
          <ApplyButton onClick={handleApplyClick} disabled={isApplyDisabled}>
            신청
          </ApplyButton>
        </div>
      </div>
    </div>
  );
}
