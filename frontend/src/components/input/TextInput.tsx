import React, { useState, useEffect } from "react";
import styles from "@/styles/components/input/text-input.module.scss"; // SCSS 모듈 임포트
import Image from "next/image"; // Next.js Image 컴포넌트

interface TextInputProps {
  children: React.ReactNode; // 필드 제목
  value: string; // 입력 필드 값 (외부에서 관리)
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; // 값 변경 핸들러
  isPassword?: boolean; // 비밀번호 입력 필드 여부
  isNotModify?: boolean; // 수정 불가능 여부
  disabled?: boolean; // 패스워드 확인 로직
  className?: string; // 외부에서 스타일을 적용할 수 있는 prop
}

const TextInput: React.FC<TextInputProps> = ({
  children,
  value,
  onChange = () => {}, // 기본값 추가 (isNotModify일 경우 필요 없음)
  isPassword = false,
  isNotModify = false,
  disabled = false,
  className = "",
}) => {
  const [showPassword, setShowPassword] = useState(false); // 비밀번호 표시 상태
  const [hasError, setHasError] = useState(true); // 초기 에러 상태를 true로 설정

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev); // 비밀번호 표시 상태 토글
  };

  useEffect(() => {
    setHasError((value?.trim() ?? "") === "");
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e);
    setHasError(e.target.value.trim() === ""); // 입력 값이 변경될 때마다 에러 상태 업데이트
  };

  return (
    <div className={`${styles.inputBox} ${className}`}>
      <p className={styles.inputP}>{children}</p>
      <div
        className={`${styles.inputWrapper} ${
          isNotModify ? styles.readOnlyWrapper : ""
        }`}
      >
        <input
          type={isPassword && !showPassword ? "password" : "text"} // 비밀번호 상태에 따라 type 변경
          placeholder={isNotModify ? "" : `${children}를 입력해주세요`} // placeholder는 수정 가능한 경우만 표시
          value={value} // 외부에서 전달된 값 사용
          onChange={isNotModify ? undefined : handleChange} // 수정 불가능 상태일 경우 onChange 제거
          readOnly={isNotModify} // 수정 불가능 상태 설정
          className={`${styles.inputField} ${
            isNotModify ? styles.readOnlyInput : ""
          } ${hasError ? styles.errorInput : ""}`} // 상태에 따른 스타일 적용
        />
        {isPassword &&
          !isNotModify && ( // 비밀번호 토글 버튼은 수정 가능한 경우만 표시
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className={styles.toggleButton}
            >
              <Image
                src={
                  showPassword ? "/icon/close_eye.svg" : "/icon/open_eye.svg"
                } // 동적 이미지 변경
                alt={showPassword ? "비밀번호 숨기기" : "비밀번호 표시"}
                width={20} // 아이콘 너비
                height={20} // 아이콘 높이
              />
            </button>
          )}
      </div>
      {hasError && (
        <p className={styles.errorMessage}>{children}를 입력해주세요.</p>
      )}{" "}
      {/* 에러 메시지 표시 */}
    </div>
  );
};

export default TextInput;
