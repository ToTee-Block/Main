import React from "react";
import styles from "@/styles/components/button/check-button.module.scss";

interface CheckButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}

const CheckButton: React.FC<CheckButtonProps> = ({
  onClick,
  disabled = false,
  children,
}) => {
  return (
    <button
      className={styles.checkButton}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default CheckButton;
