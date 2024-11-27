import React, { useState } from "react";
import styles from "@/styles/components/input/text-input.module.scss"; // SCSS 모듈 임포트
import Image from "next/image"; // Next.js Image 컴포넌트

interface TextInputProps {
  children: React.ReactNode; // 필드 제목
  value: string; // 입력 필드 값 (외부에서 관리)
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // 값 변경 핸들러
  isPassword?: boolean; // 비밀번호 입력 필드 여부
}

const TextInput: React.FC<TextInputProps> = ({
  children,
  value,
  onChange,
  isPassword = false,
}) => {
  const [showError, setShowError] = useState(true); // 에러 메시지 상태
  const [showPassword, setShowPassword] = useState(false); // 비밀번호 표시 상태

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // 외부로 전달된 onChange 핸들러 호출
    onChange(e);

    // 글자가 입력되면 에러 숨기기
    if (inputValue.trim() !== "") {
      setShowError(false);
    } else {
      setShowError(true);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev); // 비밀번호 표시 상태 토글
  };

  return (
    <div className={styles.inputBox}>
      <p className={styles.inputP}>{children}</p>
      <div className={styles.inputWrapper}>
        <input
          type={isPassword && !showPassword ? "password" : "text"} // 비밀번호 상태에 따라 type 변경
          placeholder={`${children}를 입력해주세요`}
          value={value} // 외부에서 전달된 값 사용
          onChange={handleChange} // 입력 값 변화 시 처리
          className={showError ? styles.inputError : ""} // 에러 상태 시 스타일 적용
        />
        {isPassword && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className={styles.toggleButton}
          >
            <Image
              src={showPassword ? "/icon/close_eye.svg" : "/icon/open_eye.svg"} // 동적 이미지 변경
              alt={showPassword ? "비밀번호 숨기기" : "비밀번호 표시"}
              width={20} // 아이콘 너비
              height={20} // 아이콘 높이
            />
          </button>
        )}
      </div>
      {showError && (
        <div className={styles.errorMessage}>
          <p>{children}를 입력해주세요.</p>
        </div>
      )}
    </div>
  );
};

export default TextInput;
