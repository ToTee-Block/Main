"use client";

import React, { useState } from "react";
import styles from "@/styles/components/input/text-input.module.scss";
import Image from "next/image";

interface TextInputProps {
  children: React.ReactNode;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isPassword?: boolean;
  isNotModify?: boolean;
  disabled?: boolean;
}

const TextInput: React.FC<TextInputProps> = ({
  children,
  value,
  onChange = () => {},
  isPassword = false,
  isNotModify = false,
  disabled = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className={styles.inputBox}>
      <p className={styles.inputP}>{children}</p>
      <div className={styles.inputWrapper}>
        <input
          type={isPassword && !showPassword ? "password" : "text"}
          placeholder={isNotModify ? "" : `${children}를 입력해주세요`}
          value={value}
          onChange={isNotModify ? undefined : onChange}
          readOnly={isNotModify}
          disabled={disabled || isNotModify}
          className={styles.inputField}
        />
        {isPassword && !isNotModify && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className={styles.toggleButton}
            disabled={disabled}
          >
            <Image
              src={showPassword ? "/icon/close_eye.svg" : "/icon/open_eye.svg"}
              alt={showPassword ? "비밀번호 숨기기" : "비밀번호 표시"}
              width={20}
              height={20}
            />
          </button>
        )}
      </div>
    </div>
  );
};

export default TextInput;
