'use client';

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import styles from "@/styles/components/header.module.scss";
import LinkButton from "./button/LinkButton";

// 커스텀 이벤트 정의
const LOGIN_EVENT = 'onLogin';
const LOGOUT_EVENT = 'onLogout';

interface Notification {
  id: number;
  message: string;
  isRead: boolean;
}

const Header: React.FC = () => {
  const pathname = usePathname();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hasNewNotification, setHasNewNotification] = useState(false);

  // 초기 로그인 상태 체크
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedName = localStorage.getItem('name');
    if (token) {
      setIsLoggedIn(true);
      setUserName(storedName || '사용자');
    }

    // 로그인 이벤트 리스너
    const handleLogin = (e: CustomEvent) => {
      const { name } = e.detail;
      setIsLoggedIn(true);
      setUserName(name || '사용자');
    };

    // 이벤트 리스너 등록
    window.addEventListener(LOGIN_EVENT, handleLogin as EventListener);

    // 알림 체크 (예시: 5초마다 새로운 알림 확인)
    let notificationInterval: NodeJS.Timeout | null = null;

    if (isLoggedIn) {
      const checkNewNotifications = () => {
        // 백엔드 연동 전까지는 빈 배열 사용
        const mockNotifications: Notification[] = [];
        setNotifications(mockNotifications);
        setHasNewNotification(false);
      };

      notificationInterval = setInterval(checkNewNotifications, 5000);
    }

    return () => {
      window.removeEventListener(LOGIN_EVENT, handleLogin as EventListener);
      if (notificationInterval) {
        clearInterval(notificationInterval);
      }
    };
  }, [isLoggedIn]);

  // pathname이 변경될 때마다 드롭다운 메뉴 닫기
  useEffect(() => {
    setShowProfileMenu(false);
    setShowNotifications(false);
  }, [pathname]);

  // 페이지 새로고침 시 드롭다운 메뉴 닫기
  useEffect(() => {
    const handleBeforeUnload = () => {
      setShowProfileMenu(false);
      setShowNotifications(false);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const isActive = (path: string): boolean => {
    if (!pathname) return false;
    return pathname === path;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    setIsLoggedIn(false);
    setUserName('');
    window.dispatchEvent(new Event(LOGOUT_EVENT));
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
    setShowNotifications(false);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setShowProfileMenu(false);
    if (hasNewNotification) {
      setHasNewNotification(false);
      // 여기에 알림 읽음 처리 API 호출 추가
    }
  };

  return (
    <header className={styles.header}>
      <Link href="/">
        <img src="/images/logo.svg" alt="logo" />
      </Link>
      <div className={styles.navSection}>
        <nav className={styles.nav}>
          <Link href="/about">
            <span className={isActive("/about") ? styles.active : ""}>토티블록</span>
          </Link>
          <Link href="/post">
            <span className={isActive("/post") ? styles.active : ""}>블로그</span>
          </Link>
          <Link href="/qna">
            <span className={isActive("/qna") ? styles.active : ""}>질문답변</span>
          </Link>
          <Link href="/mentor">
            <span className={isActive("/mentor") ? styles.active : ""}>멘토찾기</span>
          </Link>
          <Link href="/mentor/form">
            <span className={isActive("/mentor/form") ? styles.active : ""}>멘토신청</span>
          </Link>
        </nav>
        {isLoggedIn ? (
          <div className={styles.userSection}>
            <div className={styles.userInfo} onClick={toggleProfileMenu}>
              <Image 
                src="/icon/user.svg" 
                alt="profile" 
                width={40} 
                height={40} 
                className={styles.userImage}
              />
              <span className={styles.userName}>{userName}</span>
              <Image 
                src="/icon/more.svg" 
                alt="more" 
                width={18} 
                height={18}
              />
              {showProfileMenu && (
                <div className={styles.dropdown}>
                  <Link href="/members/me" className={styles.dropdownItem}>My Profile</Link>
                  <Link href="/members/password" className={styles.dropdownItem}>Modify Password</Link>
                  <Link href="/blog" className={styles.dropdownItem}>My Blog</Link>
                  <Link href="/qna" className={styles.dropdownItem}>My QnA</Link>
                  <button onClick={handleLogout} className={styles.dropdownItem}>Logout</button>
                </div>
              )}
            </div>
            <div className={styles.iconWrapper}>
              <button onClick={toggleNotifications} className={styles.iconButton}>
                <Image 
                  src="/icon/mdi_bell.svg" 
                  alt="notifications" 
                  width={24} 
                  height={24} 
                />
                {hasNewNotification && <div className={styles.notificationDot} />}
              </button>
              {showNotifications && notifications.length > 0 && (
                <div className={styles.dropdown}>
                  {notifications.map(notification => (
                    <div key={notification.id} className={styles.dropdownItem}>
                      {notification.message}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <LinkButton to="/members">Login</LinkButton>
        )}
      </div>
    </header>
  );
};

export default Header;