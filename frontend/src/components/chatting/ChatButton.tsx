"use client";

import styles from "@/styles/components/chatting/ChatButton.module.scss";

interface ChatButtonProps {
  onClick: () => void;
}

const ChatButton: React.FC<ChatButtonProps> = ({ onClick }) => {
  return (
    <button className={styles.chatButton} onClick={onClick}>
      💬
    </button>
  );
};

export default ChatButton;
