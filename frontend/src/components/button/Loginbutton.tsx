// components/SubmitButton.tsx
import React from "react";
import styles from "@/styles/components/button/login-button.module.scss"; // SCSS 모듈 임포트

interface LoginButtonProps {
  children: React.ReactNode; // 버튼 내용 (필수)
  onClick?: () => void; // 클릭 이벤트 핸들러 (선택적)
  disabled?: boolean; // 버튼 비활성화 여부 (선택적)
}

const LoginButton: React.FC<LoginButtonProps> = ({
  children,
  onClick,
  disabled = false,
}) => {
  return (
    <button
      type="submit"
      onClick={onClick} // 클릭 핸들러 추가
      disabled={disabled} // 비활성화 여부 처리
      className={`${styles.loginButton} ${disabled ? styles.disabled : ""}`} // 비활성화 시 스타일 추가
    >
      {children}
    </button>
  );
};

export default LoginButton;
