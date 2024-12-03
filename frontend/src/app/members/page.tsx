"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/api/axiosConfig";
import LoginButton from "@/components/button/Loginbutton";
import TextInput from "@/components/input/TextInput";
import styles from "@/styles/pages/members/login.module.scss";
import Link from "next/link";

interface LoginResponse {
  resultCode: string;
  msg: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

export default function Login() {
  const [email, setEmail] = useState<string>(""); // 이메일 상태
  const [password, setPassword] = useState<string>(""); // 비밀번호 상태
  const [error, setError] = useState<string | null>(null); // 에러 메시지 상태
  const [loading, setLoading] = useState<boolean>(false); // 로딩 상태
  const router = useRouter(); // Next.js useRouter 훅

  // 로그인 API 호출 함수
  const login = async (
    email: string,
    password: string
  ): Promise<LoginResponse> => {
    try {
      const response = await apiClient.post<LoginResponse>(
        "/api/v1/members/login",
        { email, password }
      );
      console.log("로그인 성공:", response.data);

      // 서버 응답 데이터 구조 확인
      if (!response.data.data.accessToken || !response.data.data.refreshToken) {
        throw new Error("토큰 정보가 서버 응답에 없습니다.");
      }

      return response.data;
    } catch (err: any) {
      console.error("로그인 실패:", err.response?.data || err.message);
      setError(err.response?.data?.msg || "로그인에 실패했습니다.");
      throw err;
    }
  };

  // 로그인 처리 함수
  const handleLogin = async () => {
    setError(null); // 이전 에러 초기화
    setLoading(true); // 로딩 시작

    try {
      const result = await login(email, password);

      // JWT 토큰 저장
      const { accessToken, refreshToken } = result.data;
      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      console.log("JWT 토큰 저장 성공:", {
        token: accessToken,
        refreshToken: refreshToken,
      });

      // 로그인 성공 시 메인 페이지로 리다이렉트
      router.push("/");
    } catch (err) {
      console.error("로그인 중 오류 발생:", err);
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  // 입력 핸들러 (에러 초기화)
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError(null);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setError(null);
  };

  return (
    <div className={styles.container}>
      <p className={styles.loginTitle}>로그인</p>
      <div className={styles.loginBox}>
        {/* 아이디 입력 */}
        <TextInput value={email} onChange={handleEmailChange}>
          아이디
        </TextInput>
        {/* 비밀번호 입력 */}
        <TextInput isPassword value={password} onChange={handlePasswordChange}>
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
        <LoginButton
          onClick={handleLogin}
          disabled={loading || !email || !password}
        >
          {loading ? "로그인 중..." : "로그인"}
        </LoginButton>
      </div>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
