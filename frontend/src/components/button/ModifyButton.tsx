import React from "react";
import styles from "@/styles/components/button/modify-button.module.scss"; // SCSS 모듈 임포트

interface ModifyButtonProps {
  to: string; // 이동할 경로 (필수)
}

const commentPost = async (to: string) => {
  console.log(to);
};

const ModifyButton: React.FC<ModifyButtonProps> = ({ to }) => {
  return (
    <button onClick={() => commentPost(to)} className={styles.modifytBtn}>
      수정하기
    </button>
  );
};

export default ModifyButton;
