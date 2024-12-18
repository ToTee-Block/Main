"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import styles from "@/styles/components/header.module.scss";
import LinkButton from "./button/LinkButton";

const Header: React.FC = () => {
  const pathname = usePathname();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasNewNotification, setHasNewNotification] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const isActive = (path: string) => pathname === path;

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
    setShowNotifications(false);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setShowProfileMenu(false);
  };

  return (
    <header className={styles.header}>
      <Link href="/">
        <img src="/images/logo.svg" alt="logo" />
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
          <Link href="/mentor">
            <span className={isActive("/mentor") ? styles.active : ""}>
              멘토찾기
            </span>
          </Link>
          <Link href="/mentor/form">
            <span className={isActive("/mentor/form") ? styles.active : ""}>
              멘토신청
            </span>
          </Link>
        </nav>
        {isLoggedIn ? (
          isAdmin ? (
            <div className={styles.adminSection}>
              <span>관리자</span>
              <div className={styles.iconWrapper}>
                <button
                  onClick={toggleNotifications}
                  className={styles.iconButton}
                >
                  <Image
                    src="/icon/mdi_bell.svg"
                    alt="notifications"
                    width={24}
                    height={24}
                  />
                  {hasNewNotification && (
                    <div className={styles.notificationDot} />
                  )}
                </button>
                {showNotifications && (
                  <div className={styles.dropdown}>
                    <div className={styles.dropdownItem}>
                      A멘티님께서 멘토를 신청 하셨습니다.
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className={styles.userSection}>
              <div className={styles.userInfo}>
                <Image
                  src="/icon/user.svg"
                  alt="profile"
                  width={32}
                  height={32}
                  className={styles.userImage}
                />
                <span className={styles.userName}>홍길동</span>
                <button
                  onClick={toggleProfileMenu}
                  className={styles.iconButton}
                >
                  <Image
                    src="/icon/more.svg"
                    alt="more"
                    width={20}
                    height={20}
                  />
                </button>
                {showProfileMenu && (
                  <div className={styles.dropdown}>
                    <Link href="/profile" className={styles.dropdownItem}>
                      My Profile
                    </Link>
                    <Link href="/password" className={styles.dropdownItem}>
                      Modify Password
                    </Link>
                    <Link href="/blog" className={styles.dropdownItem}>
                      My Blog
                    </Link>
                    <Link href="/qna" className={styles.dropdownItem}>
                      My QnA
                    </Link>
                    <button className={styles.dropdownItem}>Logout</button>
                  </div>
                )}
              </div>
              <div className={styles.iconWrapper}>
                <button
                  onClick={toggleNotifications}
                  className={styles.iconButton}
                >
                  <Image
                    src="/icon/mdi_bell.svg"
                    alt="notifications"
                    width={24}
                    height={24}
                  />
                  {hasNewNotification && (
                    <div className={styles.notificationDot} />
                  )}
                </button>
                {showNotifications && (
                  <div className={styles.dropdown}>
                    <div className={styles.dropdownItem}>
                      A멘티님께서 멘토를 신청 하셨습니다.
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        ) : (
          <LinkButton to="/members">Login</LinkButton>
        )}
      </div>
    </header>
  );
};

export default Header;
