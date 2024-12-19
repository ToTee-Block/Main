"use client";

import React, { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import apiClient, {
  fetchNotifications,
markNotificationAsRead,
} from "@/api/axiosConfig";
import Link from "next/link";
import Image from "next/image";
import styles from "@/styles/components/header.module.scss";
import LinkButton from "./button/LinkButton";
import { fetchUserProfile } from "@/api/axiosConfig";

const LOGIN_EVENT = "onLogin";
const LOGOUT_EVENT = "onLogout";

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
 const [userName, setUserName] = useState("");
 const [notifications, setNotifications] = useState<Notification[]>([]);
 const [hasNewNotification, setHasNewNotification] = useState(false);
 const [profileImageUrl, setProfileImageUrl] = useState("/icon/user.svg");
 const [isAdmin, setIsAdmin] = useState(false);

 useEffect(() => {
   const token = localStorage.getItem("token");
   const storedName = localStorage.getItem("name");
   const userRole = localStorage.getItem("role");

   if (token) {
     setIsLoggedIn(true);
     setUserName(storedName || "사용자");
     setIsAdmin(userRole === "ADMIN");

     if (userRole !== "ADMIN") {
       const fetchProfile = async () => {
         try {
           const response = await fetchUserProfile();
           if (response.resultCode === "200" && response.data.profileImg) {
             setProfileImageUrl(`http://localhost:8081/file/${response.data.profileImg}`);
           }
         } catch (error) {
           console.error("Failed to fetch profile image:", error);
         }
       };
       fetchProfile();
     }

     const handleLogin = (e: CustomEvent) => {
       const { name } = e.detail;
       setIsLoggedIn(true);
       setUserName(name || "사용자");
     };

     window.addEventListener(LOGIN_EVENT, handleLogin as EventListener);

     let notificationInterval: NodeJS.Timeout | null = null;

     if (isLoggedIn) {
       const checkNewNotifications = () => {
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
   }
 }, [isLoggedIn]);

 useEffect(() => {
   setShowProfileMenu(false);
   setShowNotifications(false);
 }, [pathname]);

 useEffect(() => {
   const handleBeforeUnload = () => {
     setShowProfileMenu(false);
     setShowNotifications(false);
   };

   window.addEventListener("beforeunload", handleBeforeUnload);

   return () => {
     window.removeEventListener("beforeunload", handleBeforeUnload);
   };
 }, []);
  const handleLogout = async () => {
    try {
      const response = await apiClient.get("/api/v1/members/logout");
      if (response.data.resultCode === "200") {
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        setIsLoggedIn(false);
        setUserName("");
        window.dispatchEvent(new Event(LOGOUT_EVENT));
      } else {
        console.error("로그아웃 실패:", response.data.msg);
      }
    } catch (error) {
      console.error("로그아웃 중 오류 발생:", error);
    }
  };

 const isActive = (path: string): boolean => {
   if (!pathname) return false;
   return pathname === path;
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
      notifications.forEach((notif) => {
        if (!notif.read) {
          markNotificationAsRead(notif.id).then(() => {
            setNotifications((prevNotifications) =>
              prevNotifications.map((n) =>
                n.id === notif.id ? { ...n, read: true } : n
              )
            );
          });
        }
      });
    }
  };

  const toggleNotificationContent = (id: number) => {
    setExpandedNotificationId((prevId) => (prevId === id ? null : id));
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
              <Image src="/icon/more.svg" alt="more" width={18} height={18} />
              {showProfileMenu && (
                <div className={styles.dropdown}>
                  <Link href="/members/me" className={styles.dropdownItem}>
                    My Profile
                  </Link>
                  <Link
                    href="/members/password"
                    className={styles.dropdownItem}
                  >
                    Modify Password
                  </Link>
                  <Link href="/blog" className={styles.dropdownItem}>
                    My Blog
                  </Link>
                  <Link href="/qna" className={styles.dropdownItem}>
                    My QnA
                  </Link>
                  <button
                    onClick={handleLogout}
                    className={styles.dropdownItem}
                  >
                    Logout
                  </button>
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
              {showNotifications && notifications.length > 0 && (
                <div className={styles.notificationDropdown}>
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`${styles.notificationItem} ${
                        expandedNotificationId === notification.id
                          ? styles.fullText
                          : ""
                      }`}
                      onClick={() => toggleNotificationContent(notification.id)}
                    >
                      {notification.message}
                      {!notification.read && (
                        <span className={styles.unreadDot} />
                      )}
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