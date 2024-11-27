// components/chat/ChatHeader.tsx
import React from "react";
import styles from "@/styles/components/chatting/ChatHeader.module.scss";

interface ChatHeaderProps {
  roomName: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ roomName }) => {
  return (
    <div className={styles.chatHeader}>
      <h3>{roomName}</h3>
    </div>
  );
};

export default ChatHeader;
