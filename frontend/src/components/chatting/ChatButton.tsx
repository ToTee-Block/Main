"use client";

import styles from "@/styles/components/chatting/ChatButton.module.scss";

interface ChatButtonProps {
  onClick: () => void; // 클릭 핸들러
  hasUnread?: boolean; // 알림 상태 (선택적)
}

const ChatButton: React.FC<ChatButtonProps> = ({
  onClick,
  hasUnread = false,
}) => {
  return (
    <div className={styles.chatButton} onClick={onClick}>
      {hasUnread && <div className={styles.notificationDot}></div>}
      <span>💬</span>
    </div>
  );
};

export default ChatButton;
