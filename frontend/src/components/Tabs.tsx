"use client";
import React, { useState, useEffect } from "react";
import apiClient from "@/api/axiosConfig";
import MentorCard from "@/components/card/MentorCard";
import styles from "@/styles/components/tabs.module.scss";

interface Mentor {
  id: number;
  name: string;
  oneLineBio: string;
  bio: string;
  portfolio: string;
  memberID: number;
}

const Tabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [mentors, setMentors] = useState<Mentor[]>([]);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const response = await apiClient.get("/api/v1/mentors");
        if (response.data.resultCode === "200") {
          setMentors(response.data.data.content);
        }
      } catch (error) {
        console.error("멘토 정보를 가져오는 데 실패했습니다:", error);
      }
    };

    fetchMentors();
  }, []);

  const filteredMentors = mentors.filter((mentor) => {
    if (activeTab === "all") return true;
    // 여기서 멘토의 타입을 확인하는 로직을 추가해야 합니다.
    // 예를 들어, mentor.type === activeTab
    return true;
  });

  return (
    <div className={styles.tabBox}>
      <div className={styles.buttonBox}>
        <button
          className={`${styles.button} ${
            activeTab === "all" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("all")}
        >
          전체
        </button>
        <button
          className={`${styles.button} ${
            activeTab === "full" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("full")}
        >
          Full-Stack
        </button>
        <button
          className={`${styles.button} ${
            activeTab === "front" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("front")}
        >
          Front-end
        </button>
        <button
          className={`${styles.button} ${
            activeTab === "back" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("back")}
        >
          Back-end
        </button>
      </div>

      <div className={styles.card_container}>
        {filteredMentors.map((mentor) => (
          <MentorCard
            key={mentor.id}
            href={`/mentor/detail/${mentor.memberID}`}
            name={mentor.name}
            type="멘토 타입" // 백엔드에서 타입 정보를 제공해야 합니다
            description={mentor.oneLineBio}
          />
        ))}
      </div>
    </div>
  );
};

export default Tabs;
