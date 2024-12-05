"use client";

import LoginButton from "@/components/button/Loginbutton";
import TextInput from "@/components/input/TextInput";
import styles from "@/styles/pages//member/login.module.scss";
import Link from "next/link";

export default function Login() {
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
