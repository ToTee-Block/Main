"use client";

import React, { useState } from "react";
import MentorCard from "@/components/card/MentorCard";
import styles from "@/styles/components/tabs.module.scss";

const Tabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("full");

  // 각 탭에 맞는 카드 데이터
  const cardData: Record<string, { href: string; name: string; type: string; description: string;}[]> = {
    full: Array.from({ length: 10 }, (_, index) => ({
      href: `/content-full${index + 1}`,
      name: `full${index + 1}`,
      type: `full${index + 1}`,
      description: `full${index + 1}`,
      // imageUrl: `/images/Rectangle.png`, // 예시 이미지 URL / 나중에 수정 되어야함
    })),
    front: Array.from({ length: 10 }, (_, index) => ({
      href: `/content-front${index + 1}`,
      name: `front${index + 1}`,
      type: `front${index + 1}`,
      description: `front${index + 1}`,
      // imageUrl: `/images/Rectangle${index + 1}.png`, // 예시 이미지 URL / 나중에 수정 되어야함
    })),
    back: Array.from({ length: 10 }, (_, index) => ({
      href: `/content-back${index + 1}`,
      name: `back${index + 1}`,
      type: `back${index + 1}`,
      description: `back${index + 1}`,
      // imageUrl: `/images/Rectangle${index + 1}.png`, // 예시 이미지 URL / 나중에 수정 되어야함
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
            // imageUrl={card.imageUrl}
          />
        ))}
      </div>
    </div>
  );
};

export default Tabs;
