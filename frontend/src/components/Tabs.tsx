"use client";
import React, { useState } from "react";
import MentorCard from "@/components/card/MentorCard";
import styles from "@/styles/components/tabs.module.scss";
import { type } from "os";

const Tabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("full");

  // 각 탭에 맞는 카드 데이터
  const cardData: Record<string, { href: string; name: string; type: string; description: string;}[]> = {
    full: Array.from({ length: 10 }, (_, index) => ({
      href: `/content-full${index + 1}`,
      name: `박승수`,
      type: `Full-Stack`,
      description: `구글의 모든 서비스를 총괄`,
    })),
    front: Array.from({ length: 10 }, (_, index) => ({
      href: `/content-front${index + 1}`,
      name: `박승수`,
      type: `Front-end`,
      description: `프론트엔드 개발을 담당`,
    })),
    back: Array.from({ length: 10 }, (_, index) => ({
      href: `/content-back${index + 1}`,
      name: `박승수`,
      type: `Back-end`,
      description: `백엔드 개발을 담당`,
    })),
  };

  return (
    <div className={styles.tabBox}>
      <div className={styles.buttonBox}>
        <button
          className={`${styles.button} ${activeTab === "full" ? styles.active : ""}`}
          onClick={() => setActiveTab("full")}>
          Full-Stack
        </button>
        <button
          className={`${styles.button} ${activeTab === "front" ? styles.active : ""}`}
          onClick={() => setActiveTab("front")}>
          Front-end
        </button>
        <button
          className={`${styles.button} ${activeTab === "back" ? styles.active : ""}`}
          onClick={() => setActiveTab("back")}>
          Back-end
        </button>
      </div>

      <div className={styles.card_container}>
        {cardData[activeTab].map((card) => (
          <MentorCard
            key={card.href}
            href={card.href}
            name={card.name}
            type={card.type}
            description={card.description}
          />
        ))}
      </div>
    </div>
  );
};

export default Tabs;
