"use client";
import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import classNames from 'classnames';
import styles from "@/styles/pages/login.module.scss";
import TextLinkButton from "@/components/button/TextLinkButton";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/members/login",
        { email, password },
        { withCredentials: true }
      );
      console.log("로그인 성공:", response.data);
      localStorage.setItem("accessToken", response.data.data.accessToken);
      alert("로그인 성공!");
      window.location.href = "/";
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Axios 에러:", error.response?.data || error.message);
        setErrorMessage(
          "로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요."
        );
      } else {
        console.error("알 수 없는 에러:", error);
        setErrorMessage("예기치 않은 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className={styles.login_container}>
      <h1>로그인</h1>
      <form onSubmit={handleLogin}>
        <div className={styles.field_group}>
          <label htmlFor="email">아이디</label>
          <input
            type="text"
            id="email"
            placeholder="아이디를 입력해주세요."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {!email && <p className={styles.error}>아이디는 필수 항목입니다.</p>}
        </div>
        <div className={classNames(styles.field_group, styles.password_group)}>
          <label htmlFor="password">비밀번호</label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            placeholder="비밀번호를 입력해주세요."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className={styles.password_toggle_btn}
            onClick={togglePasswordVisibility}
            aria-label="비밀번호 표시"
          >
            <img
              src={showPassword ? "/icon/mdi_eye.svg" : "/icon/mdi_eye.svg"}
              alt={showPassword ? "비밀번호 숨기기" : "비밀번호 표시"}
            />
          </button>
          {!password && <p className={styles.error}>비밀번호는 필수 항목입니다.</p>}
        </div>
        {errorMessage && <p className={styles.error}>{errorMessage}</p>}
        <div className={styles.additional_links}>
          <TextLinkButton to="/member/form">회원가입</TextLinkButton>
          <span>|</span>
          <TextLinkButton to="/find-id">아이디 찾기</TextLinkButton>
          <span>|</span>
          <TextLinkButton to="/reset-password">비밀번호 재설정</TextLinkButton>
        </div>
        <button type="submit">로그인</button>
      </form>
    </div>
  );
}
