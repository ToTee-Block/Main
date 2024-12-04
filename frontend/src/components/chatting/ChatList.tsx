"use client";

import { useState, useEffect } from "react";
import ChatHeader from "./ChatHeader";
import styles from "@/styles/components/chatting/ChatList.module.scss";

interface ChatListProps {
  activeRoom: string | null;
  rooms: { id: number; name: string }[]; // rooms 타입 수정
  onRoomSelect: (roomId: string) => void;
}

interface Room {
  id: number;
  name: string;
}

const ChatList: React.FC<ChatListProps> = ({
  activeRoom,
  rooms, // rooms는 string[] 타입으로 전달됨
  onRoomSelect,
}) => {
  const [roomList, setRoomList] = useState<Room[]>([]); // 초기값을 빈 배열로 설정
  const [isLoading, setIsLoading] = useState(false);

  // 백엔드에서 채팅방 목록을 가져오기
  useEffect(() => {
    setIsLoading(true);
    fetch("http://localhost:8081/chat/rooms", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch chat rooms.");
        return res.json();
      })
      .then((data) => {
        // 받은 데이터를 Room[] 타입으로 변환하여 roomList에 설정
        const roomsWithId = data.map((room: { id: number; name: string }) => ({
          id: room.id,
          name: room.name,
        }));
        setRoomList(roomsWithId);
      })
      .catch((err) => console.error("Error fetching chat rooms:", err))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className={styles.chatList}>
      <h3 className={styles.chatListTitle}>채팅 리스트</h3>
      {isLoading ? (
        <p>Loading chat rooms...</p>
      ) : (
        roomList.map((room) => (
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
