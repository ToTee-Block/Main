"use client";

import { useState, useEffect } from "react";
import styles from "@/styles/components/chatting/ChatList.module.scss";

interface ChatListProps {
  activeRoom: string | null;
  rooms: { id: number; name: string }[]; // 채팅방 리스트
  onRoomSelect: (roomId: string) => void; // 방 선택 콜백
  notifications: {
    roomId: number;
    senderEmail: string;
    message: string;
    type: string;
    timestamp: string;
  }[]; // 알림 리스트
}

const ChatList: React.FC<ChatListProps> = ({
  activeRoom,
  rooms,
  onRoomSelect,
  notifications,
}) => {
  console.log("Notifications:", notifications);

  return (
    <div className={styles.chatList}>
      <h3 className={styles.chatListTitle}>채팅 리스트</h3>
      {rooms.map((room) => {
        // roomId에 해당하는 알림 개수를 카운트
        const unreadCount = notifications.filter(
          (n) => n.roomId === room.id
        ).length;

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
