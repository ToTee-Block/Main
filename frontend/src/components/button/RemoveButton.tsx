import React from "react";
import styles from "@/styles/components/button/remove-button.module.scss"; // SCSS 모듈 임포트

interface ReportButtonProps {
  setModalVisible: () => void;
}

const removeButton: React.FC<ReportButtonProps> = ({ setModalVisible }) => {
  return (
    <button onClick={() => setModalVisible()} className={styles.removeBtn}>
      삭제하기
    </button>
  );
};

export default removeButton;
