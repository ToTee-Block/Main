"use client";

import styles from "@/styles/components/chatting/ChatButton.module.scss";

interface ChatButtonProps {
  notifications?: { roomId: string; unreadCount: number }[]; // 선택적인 알림 리스트
  onClick?: () => void;
}

const ChatButton: React.FC<ChatButtonProps> = ({
  notifications = [],
  onClick,
}) => {
  // 전체 방에 대해 읽지 않은 메시지 개수를 합산하여 표시
  const unreadMessagesCount = notifications.reduce(
    (total, notification) => total + notification.unreadCount,
    0
  );

  return (
    <button className={styles.chatButton} onClick={onClick}>
      💬
      {unreadMessagesCount > 0 && (
        <div className={styles.notificationBubble}>{unreadMessagesCount}</div>
      )}
    </button>
  );
};

export default ChatButton;
