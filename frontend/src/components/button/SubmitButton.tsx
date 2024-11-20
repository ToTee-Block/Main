// components/SubmitButton.tsx
import React from 'react';
import styles from '@/styles/components/button/submit-button.module.scss'; // SCSS 모듈 임포트

interface SubmitButtonProps {
  children: React.ReactNode; // 버튼 내용 (필수)
  disabled?: boolean; // 버튼 비활성화 여부 (선택 사항)
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ children, disabled = false }) => {
  return (
    <button
      type="submit"
      disabled={disabled}
      className={`${styles.submitButton} ${disabled ? styles.submitButtonDisabled : ''}`} // 클래스 이름을 모듈화된 스타일로 변경
    >
      {children}
    </button>
  );
};

export default SubmitButton;
