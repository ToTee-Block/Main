// components/SubmitButton.tsx
import React from "react";
import styles from "@/styles/components/button/login-button.module.scss"; // SCSS 모듈 임포트

interface LoginButtonProps {
  children: React.ReactNode; // 버튼 내용 (필수)
}

const LoginButton: React.FC<LoginButtonProps> = ({ children }) => {
  return (
    <button
      type="submit"
      className={`${styles.loginButton}`} // 클래스 이름을 모듈화된 스타일로 변경
    >
      {children}
    </button>
  );
};

export default LoginButton;
