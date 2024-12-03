import React from "react";
import styles from "@/styles/components/button/edit-botton.module.scss";

interface EditButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

const EditButton: React.FC<EditButtonProps> = ({
  children,
  onClick,
  disabled = false,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${styles.editButton} ${disabled ? styles.disabled : ""}`}
    >
      {children}
    </button>
  );
};

export default EditButton;