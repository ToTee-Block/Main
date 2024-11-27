"use client";

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
  return (
    <div className={styles.chatList}>
      <h3 className={styles.chatListTitle}>채팅 리스트</h3> {/* 제목 추가 */}
      {rooms.map((room) => (
        <div
          key={room}
          className={`${styles.chatRoom} ${
            activeRoom === room ? styles.active : ""
          }`}
          onClick={() => onRoomSelect(room)}
        >
          <div
            className={`${styles.status} ${
              room === "박승수" ? styles.online : styles.offline
            }`}
          ></div>
          <span>{room}</span>
        </div>
      ))}
    </div>
  );
};

export default ChatList;
