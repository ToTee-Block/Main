"use client";

import { useEffect, useState } from "react";
import styles from "@/styles/components/chatting/ChatHeader.module.scss";
import Image from "next/image";

interface RoomDetails {
  id: number; // 채팅방 ID
  name: string; // 채팅방 이름
  createdAt: string; // 채팅방 생성 시간
}

interface ChatHeaderProps {
  roomDetails: RoomDetails | null; // roomDetails를 직접 전달
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ roomDetails }) => {
  const [lastActive, setLastActive] = useState<string>("");

  useEffect(() => {
    if (roomDetails) {
      // createdAt을 사용하여 lastActive를 계산하거나, 현재 시간을 기준으로 변환
      const timeDiff =
        new Date().getTime() - new Date(roomDetails.createdAt).getTime();
      const diffInMinutes = Math.floor(timeDiff / (1000 * 60));

      // 예시로, lastActive를 마지막 활동 시간으로 설정 (단순히 방 생성 시간 기준)
      setLastActive(
        diffInMinutes < 60
          ? `${diffInMinutes}분 전`
          : `${Math.floor(diffInMinutes / 60)}시간 전`
      );
    }
  }, [roomDetails]);

  if (!roomDetails) {
    return (
      <div className={styles.chatHeader}>
        <div className={styles.roomInfo}>
          <h3>채팅방을 불러오는 중...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.chatHeader}>
      <div className={styles.roomInfo}>
        <h3>{roomDetails.name}</h3>
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
