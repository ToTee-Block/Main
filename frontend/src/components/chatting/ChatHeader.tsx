// components/chat/ChatHeader.tsx
import React from "react";
import styles from "@/styles/components/chatting/ChatHeader.module.scss";
import Image from "next/image";

interface ChatHeaderProps {
  roomName: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ roomName }) => {
  return (
    <div className={styles.chatHeader}>
      <h3>{roomName}</h3>
      <Image
        src={"/icon/ellipsis.svg"} // 동적 이미지 변경
        alt={"메뉴 아이콘"}
        width={16} // 아이콘 너비
        height={16} // 아이콘 높이
      />
    </div>
  );
};

export default ChatHeader;
