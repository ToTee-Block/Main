"use client";

import React, { useState } from "react";
import axios from "axios";
import LoginButton from "@/components/button/Loginbutton";
import TextInput from "@/components/input/TextInput";
import styles from "@/styles/pages//member/login.module.scss";
import Link from "next/link";

export default function Login() {
    const [username, setUsername] = useState("");
      const [password, setPassword] = useState("");
      const [error, setError] = useState<string | null>(null);

      const handleLogin = async () => {
        try {
          // 로그인 API 호출
          const response = await axios.post("/api/login", {
            username,
            password,
          });

          // 로그인 성공 처리 (예: 토큰 저장)
          const { token } = response.data;
          localStorage.setItem("token", token); // JWT를 로컬스토리지에 저장
          alert("로그인 성공!");
          // 필요시 리다이렉트 처리
          window.location.href = "/";
        } catch (err: any) {
          // 에러 처리
          setError("로그인 실패: 아이디 또는 비밀번호를 확인해주세요.");
          console.error(err);
        }
      };
  return (
    <div className={styles.container}>
      <p className={styles.loginTitle}>로그인</p>
      <div className={styles.loginBox}>
        {/* 아이디 입력 */}
        <TextInput>아이디</TextInput>
        {/* 비밀번호 입력 */}
        <TextInput isPassword>비밀번호</TextInput>
        {/* 회원가입, 아이디 찾기, 비밀번호 재설정 */}
        <div className={styles.links}>
          <Link href="/member/join" className={styles.link}>
            회원가입
          </Link>
          <span className={styles.divider}>|</span>
          <Link href="/find-id" className={styles.link}>
            아이디 찾기
          </Link>
          <span className={styles.divider}>|</span>
          <Link href="/reset-password" className={styles.link}>
            비밀번호 재설정
          </Link>
        </div>
        {/* 로그인 버튼 */}
        <LoginButton>로그인</LoginButton>
      </div>
    </div>
  );
}
