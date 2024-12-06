// components/SubmitButton.tsx
import React from "react";
import styles from "@/styles/components/button/login-button.module.scss";

interface LoginButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const LoginButton: React.FC<LoginButtonProps> = ({
  children,
  onClick,
  disabled = false,
  className = "",
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (onClick) onClick();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={`${styles.loginButton} ${
        disabled ? styles.disabled : ""
      } ${className}`}
    >
      {children}
    </button>
  );
};

export default LoginButton;
