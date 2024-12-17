import { useEffect, useState } from "react";
import styles from "@/styles/components/chatting/ChatMessages.module.scss";

// 메시지 타입 정의
interface Message {
  text: string;
  type: "sent" | "received"; // 메시지 타입
  senderId?: number; // 발신자 ID 추가
  senderName?: string; // 발신자 이름 (옵션)
  senderProfile?: string; // 발신자 프로필 이미지 URL (옵션)
  time: string; // 메시지 전송 시간
  date: string; // 메시지 전송 날짜
}

interface ChatMessagesProps {
  roomName: string; // 채팅방 이름
  messages: Message[]; // 부모 컴포넌트에서 전달된 메시지
  senderId: number | null; // 현재 사용자 ID
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  roomName,
  messages,
  senderId,
}) => {
  // 날짜별 메시지 그룹화
  const groupedMessages = messages.reduce<Record<string, Message[]>>(
    (acc, message) => {
      if (!acc[message.date]) {
        acc[message.date] = [];
      }
      acc[message.date].push(message);
      return acc;
    },
    {}
  );

  return (
    <div className={styles.chatMessages}>
      {Object.keys(groupedMessages).map((date) => (
        <div key={date}>
          {/* 날짜 헤더 */}
          <div className={styles.dateHeader}>{date}</div>
          {/* 해당 날짜의 메시지 리스트 */}
          {groupedMessages[date].map((message, index) => (
            <div
              key={index}
              className={`${styles.chatMessage} ${
                message.type === "sent" // 메시지 타입에 따라 스타일 적용
                  ? styles.sent // 보낸 메시지는 sent 스타일
                  : styles.received // 받은 메시지는 received 스타일
              }`}
            >
              {/* 수신 메시지의 프로필과 이름 */}
              {message.type === "received" ? (
                <div className={styles.senderInfo}>
                  <img
                    src={message.senderProfile || "/icon/circle_user.svg"}
                    alt={`${
                      message.senderName || "알 수 없는 사용자"
                    }의 프로필`}
                    className={styles.profileImage}
                  />
                  <span className={styles.senderName}>
                    {message.senderName || "알 수 없는 사용자"}
                  </span>
                </div>
              ) : null}
              {/* 메시지 내용 */}
              <div className={styles.message}>
                {message.text}
                <span className={styles.time}>{message.time}</span>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ChatMessages;
