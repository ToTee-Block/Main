import React from "react";
import styles from "@/styles/components/button/apply-button.module.scss";

interface ApplyButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
  }
  
  const ApplyButton: React.FC<ApplyButtonProps> = ({
    children,
    onClick,
    disabled = false,
  }) => {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`${styles.applyButton} ${disabled ? styles.disabled : ""}`}
      >
        {children}
      </button>
    );
  };
  
  export default ApplyButton;