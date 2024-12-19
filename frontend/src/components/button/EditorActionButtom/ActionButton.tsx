"use client";

import React from "react";
import styles from "@/styles/components/button/editor/editoraction-button.module.scss";
import Image from "next/image";

interface ActionButtonProps {
  postingType: string;
  onClose: () => void;
  onDraft: () => void;
  onWrite: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  postingType,
  onClose,
  onDraft,
  onWrite,
}) => {
  return (
    <div className={styles.actionButtonsContainer}>
      <button className={styles.exitButton} onClick={onClose}>
        <Image
          src="icon/arrow.svg"
          alt="뒤로가기 화살표"
          width={12}
          height={12}
        />
        나가기
      </button>
      <div className={styles.rightButtons}>
        {postingType === "qnas" ? (
          <></>
        ) : (
          <>
            <button className={styles.draftButton} onClick={onDraft}>
              임시저장
            </button>
          </>
        )}
        <button className={styles.submitButton} onClick={onWrite}>
          작성완료
        </button>
      </div>
    </div>
  );
};
export default ActionButton;
