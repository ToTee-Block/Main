"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/api/axiosConfig";
import LoginButton from "@/components/button/Loginbutton";
import TextInput from "@/components/input/TextInput";
import CheckButton from "@/components/button/CheckButton";
import styles from "@/styles/pages/members/password.module.scss";
import Link from "next/link";
import axios from "axios";

interface PasswordResponse {
  resultCode: string;
  msg: string;
  data?: any;
}

export default function Password() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [authCode, setAuthCode] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [emailValid, setEmailValid] = useState<boolean>(false);
  const [authBtnBool, setAuthBtnBool] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const response = await apiClient.get("/api/v1/members/me");
        if (response.data.resultCode === "200" && response.data.data) {
          setEmail(response.data.data.email || "");
          setIsLogin(true);
        } else {
          setIsLogin(false);
          setEmail("");
        }
      } catch (error) {
        console.error("사용자 정보를 가져오는데 실패했습니다.", error);
        setEmail("");
      }
    };

    fetchUserEmail();
  }, []);

  const handleCheckEmail = async () => {
    if (email == "") {
      alert("이메일을 입력해주세요.");
      return;
    } else if (email.indexOf("@") == -1) {
      alert("이메일 형식이 아닙니다.");
      return;
    }
    setAuthBtnBool(true);
    try {
      const response = await axios.get(
        `http://localhost:8081/api/v1/members/code/send/${email}`
      );
      const resultCode = response.data.resultCode;
      const msg = response.data.msg;
      console.log(response);

      if (resultCode === "200") {
        console.log("인증코드 전송 성공");
        setError("");
      } else if (resultCode === "400") {
        alert(msg);
        setError(msg);
      } else {
        setError(msg || "인증코드 전송에 실패했습니다.");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.msg || "인증코드 전송에 실패했습니다.";
      setError(errorMessage);
      alert(errorMessage);
    }
  };

  const handleAuthCode = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8081/api/v1/members/code/auth`,
        {
          authcode: authCode,
        }
      );
      const resultCode = response.data.resultCode;
      const msg = response.data.msg;
      console.log(response);

      if (resultCode === "200") {
        console.log("인증완료");
        setEmailValid(true);
        setError("");
      } else if (resultCode === "400") {
        alert(msg);
        setError(msg);
      } else {
        setError(msg || "인증에 실패했습니다.");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.msg || "인증에 실패했습니다.";
      setError(errorMessage);
      alert(errorMessage);
    }
  };

  const handlePasswordChange = async () => {
    setError("");

    if (!emailValid) {
      alert("이메일 인증이 완료되지 않았습니다.");
      return;
    }

    setIsLoading(true);

    if (newPassword !== confirmPassword) {
      setError("새 비밀번호와 확인 비밀번호가 일치하지 않습니다.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.patch<PasswordResponse>(
        "http://localhost:8081/api/v1/members/password",
        {
          email: email,
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
    return emailValid && newPassword && confirmPassword && !isLoading;
  };

  return (
    <div className={styles.container}>
      <p className={styles.passwordTitle}>비밀번호 수정</p>
      <div className={styles.passwordBox}>
        <div
          className={`${styles.emailGroup} ${emailValid ? styles.dp_none : ""}`}
        >
          <TextInput
            value={email}
            className={styles.emailBox}
            {...(isLogin ? { isNotModify: true } : {})}
            onChange={isLogin ? undefined : (e) => setEmail(e.target.value)}
          >
            아이디(E-mail)
          </TextInput>
          <CheckButton onClick={handleCheckEmail}>인증</CheckButton>
        </div>
        <div
          className={`${styles.authCodeGroup} ${
            emailValid ? styles.dp_none : ""
          }`}
        >
          <TextInput
            value={authCode}
            className={styles.authCodeBox}
            autocompleteBool={false}
            isNotModify={false}
            onChange={(e) => {
              setAuthCode(e.target.value);
            }}
          >
            인증코드
          </TextInput>
          <CheckButton
            onClick={handleAuthCode}
            disabled={false}
            display={authBtnBool}
          >
            확인
          </CheckButton>
        </div>
        <TextInput
          isPassword
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          disabled={false}
          className={`${styles.wideInput} ${emailValid ? "" : styles.dp_none}`}
        >
          새 비밀번호
        </TextInput>
        <TextInput
          isPassword
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={false}
          className={`${styles.wideInput} ${emailValid ? "" : styles.dp_none}`}
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
