import React from "react";
import styles from "@/styles/components/modal/yesno-modal.module.scss";

interface YesNoModalProps {
  visible: boolean;
  questionTxt: string;
  onConfirm: () => void;
  onClose: () => void;
}

const YesNoModal: React.FC<YesNoModalProps> = ({
  visible,
  questionTxt,
  onConfirm,
  onClose,
}) => {
  if (!visible) return null;

  return (
    <div className={styles.Modal}>
      <div>
        <img src="/icon/question.svg" alt="물음표 아이콘" />
      </div>
      <div className={styles.content}>
        <span>{questionTxt}</span>
      </div>
      <div className={styles.actions}>
        <button
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          Yes
        </button>
        <button
          onClick={() => {
            onClose();
          }}
        >
          No
        </button>
      </div>
    </div>
  );
};

export default YesNoModal;
