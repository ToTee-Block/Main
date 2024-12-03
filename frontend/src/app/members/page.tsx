"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // useRouter import
import apiClient from "@/api/axiosConfig"; // Axios 인스턴스 import
import LoginButton from "@/components/button/Loginbutton";
import TextInput from "@/components/input/TextInput";
import styles from "@/styles/pages/members/login.module.scss";
import Link from "next/link";

interface LoginResponse {
  code: string;
  message: string;
  data?: any; // 로그인 성공 시 반환되는 데이터의 타입
}

export default function Login() {
  const [email, setEmail] = useState<string>(""); // 이메일 상태
  const [password, setPassword] = useState<string>(""); // 비밀번호 상태
  const [error, setError] = useState<string | null>(null); // 에러 메시지 상태
  const router = useRouter(); // Next.js useRouter 훅

  const login = async (
    email: string,
    password: string
  ): Promise<LoginResponse> => {
    try {
      const response = await apiClient.post<LoginResponse>(
        "/api/v1/members/login",
        {
          email,
          password,
        }
      );
      console.log("로그인 성공:", response.data);
      return response.data;
    } catch (err: any) {
      console.error("로그인 실패:", err.response?.data || err.message);
      setError(err.response?.data?.message || "로그인에 실패했습니다.");
      throw err;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      const response = await apiClient.get("/api/v1/members/logout");
      console.log("로그아웃 성공:", response.data);
    } catch (err: any) {
      console.error("로그아웃 실패:", err.response?.data || err.message);
      setError(err.response?.data?.message || "로그아웃에 실패했습니다.");
      throw err;
    }
  };

  const handleLogin = async () => {
    try {
      const result = await login(email, password);
      console.log("로그인 결과:", result);
      // 로그인 성공 시 메인 페이지로 리다이렉트
      router.push("/"); // "/main" 페이지로 이동
    } catch (err) {
      console.error("로그인 중 오류 발생:", err);
    }
  };

  return (
    <div className={styles.container}>
      <p className={styles.loginTitle}>로그인</p>
      <div className={styles.loginBox}>
        {/* 아이디 입력 */}
        <TextInput value={email} onChange={(e) => setEmail(e.target.value)}>
          아이디
        </TextInput>
        {/* 비밀번호 입력 */}
        <TextInput
          isPassword
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        >
          비밀번호
        </TextInput>
        {/* 회원가입, 아이디 찾기, 비밀번호 재설정 */}
        <div className={styles.links}>
          <Link href="/members/join" className={styles.link}>
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
        <LoginButton onClick={handleLogin}>로그인</LoginButton>
      </div>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
