import React from "react";
import styles from "@/styles/components/button/mentor-button.module.scss";

interface MentorButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
  }
  
  const MentorButton: React.FC<MentorButtonProps> = ({
    children,
    onClick,
    disabled = false,
  }) => {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`${styles.mentorButton} ${disabled ? styles.disabled : ""}`}
      >
        {children}
      </button>
    );
  };
  
  export default MentorButton;