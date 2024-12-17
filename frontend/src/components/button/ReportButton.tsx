import React from "react";
import styles from "@/styles/components/button/report-button.module.scss"; // SCSS 모듈 임포트

interface ReportButtonProps {
  setModalVisible: () => void;
}

const ReportButton: React.FC<ReportButtonProps> = ({ setModalVisible }) => {
  return (
    <button onClick={() => setModalVisible()} className={styles.reportBtn}>
      <img src="/icon/sad.svg" alt="썩쏘 아이콘" />
      신고하기
    </button>
  );
};

export default ReportButton;
