"use client";
import React, { useState, useEffect } from "react";
import apiClient from "@/api/axiosConfig";
import MentorCard from "@/components/card/MentorCard";
import styles from "@/styles/components/tabs.module.scss";
import Image from "next/image";

interface Mentor {
  id: number;
  name: string;
  oneLineBio: string;
  bio: string;
  portfolio: string;
  memberID: number;
  profileImg: string | null;
}

const Tabs: React.FC = () => {
  const [mentors, setMentors] = useState<Mentor[]>([]);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const response = await apiClient.get("/api/v1/mentors/hot");
        if (response.data.resultCode === "200") {
          setMentors(response.data.data);
        }
      } catch (error) {
        console.error("멘토 정보를 가져오는 데 실패했습니다:", error);
      }
    };

    fetchMentors();
  }, []);

  return (
    <div className={styles.tabBox}>
      <div className={styles.card_container}>
        {mentors.map((mentor) => (
          <MentorCard
            key={mentor.id}
            href={`/mentor/detail/${mentor.memberID}`}
            name={mentor.name}
            type=""
            description={mentor.oneLineBio}
            imageUrl={mentor.profileImg || "/icon/user.svg"}
          />
        ))}
      </div>
    </div>
  );
};

export default Tabs;
