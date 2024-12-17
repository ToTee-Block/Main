"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/api/axiosConfig";
import LoginButton from "@/components/button/Loginbutton";
import TextInput from "@/components/input/TextInput";
import CheckButton from "@/components/button/CheckButton";
import styles from "@/styles/pages/members/password.module.scss";
import Link from "next/link";

interface PasswordResponse {
  resultCode: string;
  msg: string;
  data?: any;
}

export default function Password() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCurrentPasswordValid, setIsCurrentPasswordValid] =
    useState<boolean>(false);
  const [isPasswordChecked, setIsPasswordChecked] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const response = await apiClient.get("/api/v1/members/me");
        if (response.data.resultCode === "200" && response.data.data) {
          setEmail(response.data.data.email || "");
        } else {
          console.error(
            "사용자 정보를 가져오는데 실패했습니다.",
            response.data.msg
          );
          setEmail("");
        }
      } catch (error) {
        console.error("사용자 정보를 가져오는데 실패했습니다.", error);
        setEmail("");
      }
    };

    fetchUserEmail();
  }, []);

  const handleCheckCurrentPassword = async () => {
    if (!currentPassword) {
      setError("기존 비밀번호를 입력해주세요.");
      return;
    }

    try {
      const response = await apiClient.patch("/api/v1/members/password", {
        currentPassword: currentPassword,
        newPassword: currentPassword, // 비밀번호 확인 시에는 같은 값 전송
      });

      if (response.data.resultCode === "200") {
        setIsCurrentPasswordValid(true);
        setIsPasswordChecked(true);
        setError("");
        alert("비밀번호가 확인되었습니다.");
      } else {
        setIsCurrentPasswordValid(false);
        setIsPasswordChecked(true);
        setError(response.data.msg || "비밀번호가 일치하지 않습니다.");
        alert("비밀번호가 일치하지 않습니다.");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.msg || "비밀번호 확인에 실패했습니다.";
      setError(errorMessage);
      setIsCurrentPasswordValid(false);
      setIsPasswordChecked(true);
      alert(errorMessage);
    }
  };
  const handlePasswordChange = async () => {
    setError("");

    if (!isPasswordChecked) {
      alert("기존 비밀번호 확인을 먼저 진행해주세요.");
      return;
    }

    if (!isCurrentPasswordValid) {
      alert("기존 비밀번호가 올바르지 않습니다. 다시 확인해주세요.");
      return;
    }

    setIsLoading(true);

    if (newPassword !== confirmPassword) {
      setError("새 비밀번호와 확인 비밀번호가 일치하지 않습니다.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await apiClient.patch<PasswordResponse>(
        "/api/v1/members/password",
        {
          currentPassword: currentPassword,
          newPassword: newPassword,
        }
      );

      if (response.data.resultCode === "200") {
        alert("비밀번호가 성공적으로 변경되었습니다.");
        router.push("/");
      } else {
        setError(response.data.msg || "비밀번호 변경에 실패했습니다.");
      }
    } catch (error) {
      console.error("비밀번호 변경 중 오류 발생:", error);
      setError("비밀번호 변경 중 오류가 발생했습니다. 다시 시도해 주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = () => {
    return (
      isCurrentPasswordValid && newPassword && confirmPassword && !isLoading
    );
  };

  return (
    <div className={styles.container}>
      <p className={styles.passwordTitle}>비밀번호 수정</p>
      <div className={styles.passwordBox}>
        <TextInput value={email} isNotModify className={styles.wideInput}>
          아이디(E-mail)
        </TextInput>
        <div className={styles.passwordInputGroup}>
          <TextInput
            isPassword
            value={currentPassword}
            onChange={(e) => {
              setCurrentPassword(e.target.value);
              setIsCurrentPasswordValid(false);
              setIsPasswordChecked(false);
            }}
            className={styles.passwordCheckde}
          >
            기존 비밀번호
          </TextInput>
          <CheckButton
            onClick={handleCheckCurrentPassword}
            disabled={!currentPassword}
          >
            확인
          </CheckButton>
        </div>
        <TextInput
          isPassword
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          disabled={!isCurrentPasswordValid}
          className={styles.wideInput}
        >
          새 비밀번호
        </TextInput>
        <TextInput
          isPassword
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={!isCurrentPasswordValid}
          className={styles.wideInput}
        >
          비밀번호 확인
        </TextInput>
        {error && (
          <p className={`${styles.errorMessage} ${styles.shake}`}>{error}</p>
        )}
        <div className={styles.buttonBox}>
          <Link href="/" className={styles.cancelButton}>
            나가기
          </Link>
          <LoginButton
            onClick={handlePasswordChange}
            disabled={!isFormValid()}
            className={styles.loginButton}
          >
            {isLoading ? "처리 중..." : "수정"}
          </LoginButton>
        </div>
      </div>
    </div>
  );
}
