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
  disabled,
}) => {


  return (
    <ul className={styles.stackCTGY}>
      {disabled ? (
        // disabled가 true일 때 표시할 요소
        <div></div>
      ) : (
        // disabled가 false일 때, stacks 배열을 순회하여 요소를 렌더링
        stacks.map((stack, index) => (
          <li
            key={stack} // 고유한 key 값을 추가  
            className={`${activeTab === stack ? styles.active : ""}`}
            onClick={() => setActiveTab(stack)}
          >
            <span>{stack}</span>
          </li>
        ))
      )}
    </ul>
  );
};

export default StackCTGY;