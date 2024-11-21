// components/Header.tsx
"use client"; // 클라이언트 컴포넌트로 지정

import React from "react";
import { usePathname } from "next/navigation"; // 'next/navigation'에서 usePathname 사용
import Link from "next/link";
import styles from "@/styles/components/header.module.scss";
import LinkButton from "./button/LinkButton";

const Header: React.FC = () => {
  const pathname = usePathname(); // 현재 경로를 확인하기 위해 usePathname 사용

  // 현재 경로가 선택된 링크인지 확인하는 함수
  const isActive = (path: string) => pathname === path;

  return (
    <header className={styles.header}>
      <Link href="/">
        <img src="/images/logo.svg" />
      </Link>
      <div className={styles.navSection}>
        <nav className={styles.nav}>
          <Link href="/about">
            <span className={isActive("/about") ? styles.active : ""}>
              토티블록
            </span>
          </Link>
          <Link href="/post">
            <span className={isActive("/post") ? styles.active : ""}>
              블로그
            </span>
          </Link>
          <Link href="/qna">
            <span className={isActive("/qna") ? styles.active : ""}>
              질문답변
            </span>
          </Link>
          <Link href="/mantor">
            <span className={isActive("/mantor") ? styles.active : ""}>
              멘토찾기
            </span>
          </Link>
          <Link href="/mantor/form">
            <span className={isActive("/mantor/form") ? styles.active : ""}>
              멘토신청
            </span>
          </Link>
          <Link href="/member/join">
            <span className={isActive("/member/join") ? styles.active : ""}>
              회원가입
            </span>
          </Link>
        </nav>
        <LinkButton to="/member">Login</LinkButton>
      </div>
    </header>
  );
};

export default Header;
