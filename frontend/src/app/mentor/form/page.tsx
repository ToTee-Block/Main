"use client";

import React, { useEffect, useState } from "react";
import styles from "@/styles/pages/mentor/mentor-form.module.scss";
import apiClient from "@/api/axiosConfig";
import Image from "next/image";
import ApplyButton from "@/components/button/ApplyButton";
import Tag from "@/components/tag/tag";

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

          const mentorResponse = await apiClient.get(`/api/v1/mentors/profile/${memberResponse.data.data.id}`);
          console.log("멘토 응답:", mentorResponse.data);

          if (mentorResponse.data.resultCode === "200" && mentorResponse.data.data) {
            const mentorData = mentorResponse.data.data;
            console.log("멘토 데이터:", mentorData);

            // 승인된 경우에만 detail 페이지로 이동
            console.log("멘토 승인;", mentorData);
            if (mentorData.approved === true) {
              const mentorId = mentorData.id;
              window.location.href = ("/mentor/detail/" + mentorId);
              return;
            }
              

              // 기존 신청 데이터 복원
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
        // 로그인하지 않은 경우는 페이지는 보여주되, 상호작용 시 로그인 요청
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

  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  //   if (!isLoggedIn) {
  //     alert("로그인이 필요한 서비스입니다.");
  //     window.location.href = "/members";
  //     return;
  //   }
  //   if (mentorStatus === "pending") return;

  //   const { name, value } = e.target;
  //   switch (name) {
  //     case "oneLineBio":
  //       setOneLineBio(value);
  //       break;
  //     case "bio":
  //       setBio(value);
  //       autoResize(e as React.ChangeEvent<HTMLTextAreaElement>);
  //       break;
  //     case "portfolio":
  //       setPortfolio(value);
  //       break;
  //   }
  // };

 const handleApplyClick = async () => {
    if (!isLoggedIn) {
      alert("로그인이 필요한 서비스입니다.");
      window.location.href = "/members";
      return;
    }
    // 필수 필드 검증
    if (!oneLineBio.trim() || !bio.trim() || !portfolio.trim() || selectedTags.length === 0) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    try {
      // 선택된 태그를 그대로 전송
      const response = await apiClient.post("/api/v1/mentors/registration", {
        oneLineBio: oneLineBio.trim(),
        bio: bio.trim(),
        portfolio: portfolio.trim(),
        techStacks: selectedTags  // 직접 선택된 태그 배열 전송
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
          onChange={(e) => setPortfolio(e.target.value)}
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
