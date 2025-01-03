"use client";

import { useState, useEffect } from "react";
import styles from "@/styles/components/chatting/ChatList.module.scss";

interface ChatListProps {
  activeRoom: string | null;
  rooms: { id: number; name: string }[]; // 채팅방 리스트
  onRoomSelect: (roomId: string) => void; // 방 선택 콜백
  notifications: { roomId: string; unreadCount: number }[]; // 알림 리스트
}

const ChatList: React.FC<ChatListProps> = ({
  activeRoom,
  rooms,
  onRoomSelect,
  notifications,
}) => {
  return (
    <div className={styles.chatList}>
      <h3 className={styles.chatListTitle}>채팅 리스트</h3>
      {rooms.map((room) => {
        // 해당 방의 알림 개수를 찾습니다.
        const notification = notifications.find(
          (n) => n.roomId === String(room.id)
        );
        const unreadCount = notification ? notification.unreadCount : 0;

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
              <div
                className={styles.status}
                data-count={unreadCount} // 알림 개수 표시
              >
                {unreadCount}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ChatList;
