"use client";

import { useEffect, useState } from "react";
import styles from "@/styles/components/chatting/ChatHeader.module.scss";
import Image from "next/image";

interface ChatHeaderProps {
  roomName: string;
}

interface RoomDetails {
  profileImage: string; // 채팅방 프로필 이미지
  lastActive: string; // 마지막 활동 시간
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ roomName }) => {
  const [roomDetails, setRoomDetails] = useState<RoomDetails | null>(null);

  // 백엔드에서 채팅방 세부 정보를 가져오는 함수
  useEffect(() => {
    fetch(`http://localhost:8081/chat/${roomName}/details`)
      .then((res) => res.json())
      .then((data) => setRoomDetails(data))
      .catch((err) => console.error("Failed to fetch room details:", err));
  }, [roomName]);

  return (
    <div className={styles.chatHeader}>
      <div className={styles.roomInfo}>
        <h3>{roomName}</h3>
        {/* 채팅방 프로필 이미지 */}
        {roomDetails?.profileImage && (
          <Image
            src={roomDetails.profileImage}
            alt={`${roomName}의 프로필`}
            width={40}
            height={40}
            className={styles.profileImage}
          />
        )}
        {/* 마지막 활동 시간 표시 */}
        <span className={styles.lastActive}>
          {roomDetails?.lastActive
            ? `Last active: ${roomDetails.lastActive}`
            : "No activity yet"}
        </span>
      </div>
      <Image
        src={"/icon/ellipsis.svg"} // 동적 이미지 변경
        alt={"메뉴 아이콘"}
        width={16} // 아이콘 너비
        height={16} // 아이콘 높이
      />
    </div>
  );
};

export default ChatHeader;
