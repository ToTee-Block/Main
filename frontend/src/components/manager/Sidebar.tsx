import React from "react";
import styles from "@/styles/components/manager/sidebar.module.scss";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className={styles.sidebar}>
      <ul className={styles.menuList}>
        <li
          className={`${styles.menuItem} ${
            activeTab === "members" ? styles.active : ""
          }`}
          onClick={() => onTabChange("members")}
        >
          회원 관리
        </li>
        <li
          className={`${styles.menuItem} ${
            activeTab === "mentors" ? styles.active : ""
          }`}
          onClick={() => onTabChange("mentors")}
        >
          멘토 승인 관리
        </li>
        <li
          className={`${styles.menuItem} ${
            activeTab === "posts" ? styles.active : ""
          }`}
          onClick={() => onTabChange("posts")}
        >
          게시글 관리
        </li>
        <li
          className={`${styles.menuItem} ${
            activeTab === "reportManagement" ? styles.active : ""
          }`}
          onClick={() => onTabChange("reportManagement")}
        >
          신고글 관리
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
