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

interface UserResponse {
  resultCode: string;
  msg: string;
  data: {
    email: string;
    name: string;
  };
}

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const login = async (
    email: string,
    password: string
  ): Promise<LoginResponse> => {
    console.log("login 함수 실행, 입력값 : ", { email, password });
    try {
      console.log("API 호출 시작");
      const response = await apiClient.post<LoginResponse>(
        "/api/v1/members/login",
        { email, password }
      );
      console.log("로그인 성공:", response.data);

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

  const handleLogin = async () => {
    console.log("handleLogin 함수 실행 시작");
    setError(null);
    setLoading(true);

    try {
      // 로그인 요청
      const loginResult = await login(email, password);
      const { accessToken, refreshToken } = loginResult.data;

      // 토큰 저장
      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("userId", email);

      try {
        // 사용자 정보 요청
        const userResponse = await apiClient.get<UserResponse>("/api/v1/members/me", {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });

        if (userResponse.data.data.name) {
          const { name } = userResponse.data.data;
          localStorage.setItem("name", name);

          // 로그인 이벤트 발생
          const loginEvent = new CustomEvent('onLogin', {
            detail: { 
              userId: email,
              name: name
            }
          });
          window.dispatchEvent(loginEvent);
        } else {
          throw new Error("사용자 이름 정보가 없습니다.");
        }
      } catch (userError) {
        console.error("사용자 정보 조회 실패:", userError);
        // 사용자 정보 조회 실패 시에도 로그인은 유지
        const loginEvent = new CustomEvent('onLogin', {
          detail: { 
            userId: email,
            name: email.split('@')[0] // 이메일의 @ 앞부분을 이름으로 사용
          }
        });
        window.dispatchEvent(loginEvent);
      }

      console.log("로그인 처리 완료");
      router.push("/");
    } catch (err) {
      console.error("로그인 중 오류 발생:", err);
    } finally {
      setLoading(false);
    }
  };

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
      {error && <p>{error}</p>}
    </div>
  );
}