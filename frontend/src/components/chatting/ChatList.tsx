"use client";

import { useState, useEffect } from "react";
import styles from "@/styles/components/chatting/ChatList.module.scss";

interface ChatListProps {
  activeRoom: string | null;
  rooms: { id: number; name: string }[]; // rooms 타입 수정
  onRoomSelect: (roomId: string) => void;
  isLoading: boolean; // 로딩 상태를 전달
}

const ChatList: React.FC<ChatListProps> = ({
  activeRoom,
  rooms, // rooms는 string[] 타입으로 전달됨
  onRoomSelect,
  isLoading, // 로딩 상태
}) => {
  return (
    <div className={styles.chatList}>
      <h3 className={styles.chatListTitle}>채팅 리스트</h3>
      {isLoading ? (
        <p>Loading chat rooms...</p>
      ) : (
        rooms.map((room) => (
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
        ))
      )}
    </div>
  );
};

export default ChatList;
