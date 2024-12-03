"use client";

import { useState, useEffect } from "react";
import styles from "@/styles/components/chatting/ChatList.module.scss";

interface ChatListProps {
  activeRoom: string | null;
  rooms: string[];
  onRoomSelect: (room: string) => void;
}

const ChatList: React.FC<ChatListProps> = ({
  activeRoom,
  rooms,
  onRoomSelect,
}) => {
  const [roomList, setRoomList] = useState<string[]>(rooms);
  const [isLoading, setIsLoading] = useState(false);

  // 백엔드에서 채팅방 목록을 가져오기
  useEffect(() => {
    setIsLoading(true);
    fetch("http://localhost:8081/chat/rooms")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch chat rooms.");
        return res.json();
      })
      .then((data) => {
        // 채팅방 목록을 백엔드에서 받은 데이터로 업데이트
        setRoomList(data);
      })
      .catch((err) => console.error("Error fetching chat rooms:", err))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className={styles.chatList}>
      <h3 className={styles.chatListTitle}>채팅 리스트</h3> {/* 제목 추가 */}
      {isLoading ? (
        <p>Loading chat rooms...</p>
      ) : (
        roomList.map((room) => (
          <div
            key={room}
            className={`${styles.chatRoom} ${
              activeRoom === room ? styles.active : ""
            }`}
            onClick={() => onRoomSelect(room)}
          >
            <span>{room}</span>
            {room === "박승수" && <div className={styles.status}></div>}
          </div>
        ))
      )}
    </div>
  );
};

export default ChatList;
