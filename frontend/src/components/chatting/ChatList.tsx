"use client";

import styles from "@/styles/components/chatting/ChatList.module.scss";

interface ChatListProps {
  activeRoom: string | null; // 현재 활성화된 방 ID
  rooms: { id: number; name: string }[]; // 채팅방 리스트
  onRoomSelect: (roomId: string) => void; // 방 선택 시 실행되는 콜백 함수
  notifications: { [roomId: string]: boolean }; // 방별 알림 상태
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
      {rooms.map((room) => (
        <div
          key={room.id}
          className={`${styles.chatRoom} ${
            activeRoom === String(room.id) ? styles.active : ""
          }`}
          onClick={() => onRoomSelect(String(room.id))}
        >
          {/* 방 이름 표시 */}
          <span>{room.name}</span>

          {/* 알림 표시 */}
          {notifications[String(room.id)] && (
            <div className={styles.notificationIndicator}></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ChatList;
