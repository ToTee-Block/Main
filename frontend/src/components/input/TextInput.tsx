import React, { useState } from "react";
import styles from "@/styles/components/input/text-input.module.scss"; // SCSS 모듈 임포트
import Image from "next/image"; // Next.js Image 컴포넌트

interface TextInputProps {
  children: React.ReactNode;
  isPassword?: boolean; // 비밀번호 입력 필드 여부
}

const TextInput: React.FC<TextInputProps> = ({
  children,
  isPassword = false,
}) => {
  const [inputValue, setInputValue] = useState(""); // 입력 값 상태
  const [showError, setShowError] = useState(true); // 에러 메시지 상태
  const [showPassword, setShowPassword] = useState(false); // 비밀번호 표시 상태

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    // 글자가 입력되면 에러 숨기기
    if (value.trim() !== "") {
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
      <p>{children}</p>
      <div className={styles.inputWrapper}>
        <input
          type={isPassword && !showPassword ? "password" : "text"} // 비밀번호 상태에 따라 type 변경
          id="username"
          name="username"
          placeholder={`${children}를 입력해주세요`}
          value={inputValue}
          onChange={handleChange} // 입력 값 변화 시 처리
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
