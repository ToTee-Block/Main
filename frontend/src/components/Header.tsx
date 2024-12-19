"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
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

 const isActive = (path: string): boolean => {
   if (!pathname) return false;
   return pathname === path;
 };

 const handleLogout = () => {
   localStorage.removeItem("token");
   localStorage.removeItem("name");
   setIsLoggedIn(false);
   setUserName("");
   setProfileImageUrl("/icon/user.svg");
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
           <div className={isAdmin ? `${styles.userInfo} ${styles.isAdmin}` : styles.userInfo} onClick={toggleProfileMenu}>
             {isAdmin ? (
               <span className={styles.userName}>관리자</span>
             ) : (
               <>
                 <span className={styles.userName}>{userName}</span>
               </>
             )}
             <Image src="/icon/more.svg" alt="more" width={18} height={18} />
             {showProfileMenu && (
               <div className={styles.dropdown}>
                 {isAdmin ? (
                   <>
                     <Link href="/members/password" className={styles.dropdownItem}>
                       Modify Password
                     </Link>
                     <button onClick={handleLogout} className={styles.dropdownItem}>
                       Logout
                     </button>
                   </>
                 ) : (
                   <>
                     <Link href="/members/me" className={styles.dropdownItem}>
                       My Profile
                     </Link>
                     <Link href="/members/password" className={styles.dropdownItem}>
                       Modify Password
                     </Link>
                     <Link href="/post/my" className={styles.dropdownItem}>
                       My Blog
                     </Link>
                     <Link href="/qna" className={styles.dropdownItem}>
                       My QnA
                     </Link>
                     <button onClick={handleLogout} className={styles.dropdownItem}>
                       Logout
                     </button>
                   </>
                 )}
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
                 {notifications.map((notification) => (
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