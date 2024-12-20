"use client";

import React, { useState } from "react";
import styles from "@/styles/pages/mentor/mentor-form.module.scss";
import apiClient from "@/api/axiosConfig";
import Image from "next/image";
import ApplyButton from "@/components/button/ApplyButton";
import Tag from "@/src/components/tag/tag";

export default function MentorForm() {
  const [isApplyDisabled, setIsApplyDisabled] = useState(false);
  const [isReapplyDisabled, setIsReapplyDisabled] = useState(false);
  const [selectedTags, setSelectedTags] = useState(Array(16).fill(false));
  const [oneLineBio, setOneLineBio] = useState("");
  const [bio, setBio] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const techTags = Array(16).fill("Text");

  const handleApplyClick = async () => {
    setIsApplyDisabled(true);
    setErrorMessage("");
    try {
      const response = await apiClient.post("/api/v1/mentors/registration", {
        oneLineBio,
        bio,
        portfolio,
      });
      if (response.data.resultCode === "200") {
        alert("멘토 등록 신청이 성공적으로 접수되었습니다.");
      } else {
        setErrorMessage(response.data.msg || "멘토 등록 신청에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error applying for mentor:", error);
      setErrorMessage(
        "멘토 등록 신청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
      );
    } finally {
      setIsApplyDisabled(false);
    }
  };

  const handleReapplyClick = () => {
    setIsReapplyDisabled(true);
    // Implement reapply logic here
  };

  const onTagToggle = (index: number): void => {
    setSelectedTags((prev) => {
      const newState = [...prev];
      newState[index] = !newState[index];
      return newState;
    });
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
            src="/icon/user.svg"
            alt="Profile"
            width={80}
            height={80}
            className={styles.profileImage}
          />
        </div>
        <div className={styles.iconGroup}>
          <button className={styles.iconButton}>
            <Image
              src="/icon/basicimage.svg"
              alt="Upload"
              width={32}
              height={32}
            />
          </button>
          <button className={styles.iconButton}>
            <Image src="/icon/trash.svg" alt="Delete" width={32} height={32} />
          </button>
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
          onChange={(e) => setBio(e.target.value)}
        />
      </div>

      <div className={`${styles.formBox} ${styles.techStackBox}`}>
        <h3 className={styles.boxTitle}>기술 스택</h3>
        <Tag
          tags={techTags}
          selectedTags={selectedTags}
          onTagToggle={onTagToggle}
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
        <div className={styles.submitButton}>
          <ApplyButton
            onClick={handleReapplyClick}
            disabled={isReapplyDisabled}
          >
            재신청
          </ApplyButton>
        </div>
      </div>
    </div>
  );
}
