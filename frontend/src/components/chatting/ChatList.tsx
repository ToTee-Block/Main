"use client";

import { useState, useEffect } from "react";
import styles from "@/styles/components/chatting/ChatList.module.scss";

interface ChatListProps {
  activeRoom: string | null;
  rooms: { id: number; name: string }[]; // 채팅방 리스트
  onRoomSelect: (roomId: string) => void; // 방 선택 콜백
}

const ChatList: React.FC<ChatListProps> = ({
  activeRoom,
  rooms,
  onRoomSelect, // 로딩 상태
}) => {
  return (
    <div className={styles.chatList}>
      <h3 className={styles.chatListTitle}>채팅 리스트</h3>
      {rooms.map((room) => (
        <div
          key={room.id}
          className={`${styles.chatRoom} ${
            activeRoom === String(room.id) ? styles.active : ""
          }`}
          onClick={() => onRoomSelect(String(room.id))}
        >
          <span>{room.name}</span>
          {room.name === "박승수" && <div className={styles.status}></div>}
        </div>
      ))}
    </div>
  );
};

export default ChatList;
