import React from "react";
import styles from "@/styles/components/button/check-button.module.scss";

interface CheckButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  display?: boolean;
}

const CheckButton: React.FC<CheckButtonProps> = ({
  onClick,
  disabled = false,
  children,
  display,
}) => {
  return (
    <button
      className={`${styles.checkButton} ${
        display === false ? styles.dp_hidden : ""
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default CheckButton;
