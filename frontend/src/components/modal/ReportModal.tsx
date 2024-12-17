import React, { useState } from "react";
import styles from "@/styles/components/modal/report-modal.module.scss";
import TextInput from "../input/TextInput";

interface YesNoModalProps {
  visible: boolean;
  onConfirm: () => void;
  onClose: () => void;
  setReportActiveNum: (index: Number) => void;
  reportActiveNum: Number;
}

const YesNoModal: React.FC<YesNoModalProps> = ({
  visible,
  onConfirm,
  onClose,
  setReportActiveNum,
  reportActiveNum,
}) => {
  const [reportSelects, setReportSelects] = useState<string[]>([
    "예시1",
    "예시2",
  ]);
  const [reportInput, setReportInput] = useState<string>();

  if (!visible) return null;

  return (
    <div className={styles.Modal}>
      <div className={styles.topBox}>
        <span>신고하기</span>
        <button onClick={onClose}>
          <img src="/icon/x-close.svg" alt="x닫기아이콘" />
        </button>
      </div>
      <ul className={styles.select}>
        {reportSelects.map((content, index) => (
          <li key={index}>
            <div
              className={`${styles.custumCheckBox} ${
                reportActiveNum === index ? styles.active : ""
              }`}
              onClick={() => {
                setReportActiveNum(index);
                console.log(reportSelects[reportActiveNum]);
              }}
            >
              <div className={styles.check}></div>
            </div>
            <span>{content}</span>
          </li>
        ))}
      </ul>
      <div className={styles.actions}>
        <TextInput
          onChange={(e) => {
            setReportInput(e.target.value);
          }}
          placeholder="기타 내용을 입력해주세요.."
        ></TextInput>
        <button
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          확인
        </button>
      </div>
    </div>
  );
};

export default YesNoModal;
