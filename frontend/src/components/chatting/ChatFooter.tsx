"use client";

import { useState } from "react";
import styles from "@/styles/components/chatting/ChatFooter.module.scss";

interface ChatFooterProps {
  onSend: (message: string) => void; // 상위 컴포넌트로 메시지 전달
  activeRoom: string | null; // 활성화된 채팅방
}

const ChatFooter: React.FC<ChatFooterProps> = ({ onSend, activeRoom }) => {
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !activeRoom) return;

    // 백엔드로 메시지 전송
    try {
      const response = await fetch("http://localhost:8081/chat/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          roomName: activeRoom,
          message,
        }),
      });

      if (response.ok) {
        // 메시지 전송 성공, 부모 컴포넌트로 메시지 전달
        onSend(message);

        // 입력창 초기화
        setMessage("");
      } else {
        const data = await response.json();
        console.error("Error sending message:", data.message);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  return (
    <div className={styles.chatFooter}>
      <form onSubmit={handleSubmit}>
        {/* 이모티콘 버튼 */}
        <button type="button" className={styles.iconButton}>
          <img
            src={"/icon/face_smile.svg"} // 이모티콘 아이콘
            alt={"이모티콘 버튼"}
            className={styles.iconImage}
          />
        </button>

        <input
          type="text"
          id="chatInput"
          value={message}
          onChange={handleInputChange}
          placeholder="메시지를 입력하세요..."
        />

        {/* 멘션 버튼 */}
        <button type="button" className={styles.iconButton}>
          <img
            src={"/icon/at_sign.svg"} // 멘션 아이콘
            alt={"멘션 버튼"}
            className={styles.iconImage}
          />
        </button>

        <button type="submit" className={styles.iconButton}>
          <img
            src={"/icon/location_arrow.svg"} // 전송버튼
            alt={"전송버튼"}
            className={styles.profileImage}
          />
        </button>
      </form>
    </div>
  );
};

export default ChatFooter;
