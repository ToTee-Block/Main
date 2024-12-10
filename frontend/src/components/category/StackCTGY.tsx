"use client";
import React, { useState } from "react";
import styles from "@/styles/components/category/stack-ctgy.module.scss";

interface StackCTGYProps {
  stacks: string[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onClick?: () => void;
  disabled?: boolean;
}

const StackCTGY: React.FC<StackCTGYProps> = ({
  stacks,
  activeTab,
  setActiveTab,
  onClick,
  disabled = false,
}) => {


  return (
    <ul className={styles.stackCTGY}>
      {stacks.map((stacks, index) => (
        <li
          key={stacks} // 고유한 key 값을 추가  
          className={`${activeTab === stacks ? styles.active : ""}`}
          onClick={() => setActiveTab(stacks)}
        >
          <span>{stacks}</span>
        </li>
      ))}
    </ul>
  );
};

export default StackCTGY;