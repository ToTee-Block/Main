"use client";

import { useEffect } from "react";
import styles from "@/styles/components/chatting/ChatList.module.scss";

interface ChatListProps {
  activeRoom: string | null;
  rooms: { id: number; name: string }[]; // 채팅방 리스트
  onRoomSelect: (roomId: string) => void; // 방 선택 콜백
  notifications: {
    roomId: string;
    senderEmail: string;
    message: string;
    unreadCount: number; // 각 알림의 읽지 않은 메시지 개수
    timestamp: string;
  }[]; // 알림 리스트
}

const ChatList: React.FC<ChatListProps> = ({
  activeRoom,
  rooms,
  onRoomSelect,
  notifications,
}) => {
  useEffect(() => {
    console.log("Notifications updated:", notifications);
  }, [notifications]);

  return (
    <div className={styles.chatList}>
      <h3 className={styles.chatListTitle}>채팅 리스트</h3>
      {rooms.map((room) => {
        // roomId에 해당하는 읽지 않은 메시지 개수 합산
        const unreadCount = notifications
          .filter((n) => n.roomId === String(room.id))
          .reduce((total, n) => total + n.unreadCount, 0);

        console.log(`Room ID: ${room.id}, Unread Count: ${unreadCount}`);

        return (
          <div
            key={room.id}
            className={`${styles.chatRoom} ${
              activeRoom === String(room.id) ? styles.active : ""
            }`}
            onClick={() => onRoomSelect(String(room.id))}
          >
            <span>{room.name}</span>
            {/* 알림이 있으면 표시 */}
            {unreadCount > 0 && (
              <div className={styles.status}>{unreadCount}</div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ChatList;
