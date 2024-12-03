import React from "react";
import styles from "@/styles/components/button/mentor-apply-button.module.scss";

interface MentorApplyButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

const MentorApplyButton: React.FC<MentorApplyButtonProps> = ({
  children,
  onClick,
  disabled = false,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${styles.mentorApplyButton} ${disabled ? styles.disabled : ""}`}
    >
      {children}
    </button>
  );
};

export default MentorApplyButton;