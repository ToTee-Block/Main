import { useEffect, useState } from "react";
import styles from "@/styles/components/chatting/ChatMessages.module.scss";

// 메시지 타입 정의
interface Message {
  text: string; // 메시지 내용 (텍스트 또는 이미지 URL)
  type: "sent" | "received" | "image"; // 메시지 타입
  contentType: "image" | "text"; // 콘텐츠 타입 (이미지, 텍스트)
  senderId?: number; // 발신자 ID
  senderName?: string; // 발신자 이름
  senderProfile?: string; // 발신자 프로필 이미지 URL
  time: string; // 메시지 전송 시간
  date: string; // 메시지 전송 날짜
}

interface ChatMessagesProps {
  roomName: string; // 채팅방 이름
  messages: Message[]; // 메시지 배열
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
                message.type === "sent" ? styles.sent : styles.received
              }`}
            >
              {/* 수신 메시지의 프로필과 이름 */}
              {message.type === "received" && (
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
              )}
              {/* 메시지 내용 */}
              <div className={styles.message}>
                {message.contentType === "image" ? (
                  <img
                    src={`http://localhost:8081${message.text}`} // 앞에 서버 주소 추가
                    alt="전송된 이미지"
                    className={styles.imageMessage}
                  />
                ) : (
                  <span>{message.text}</span>
                )}
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
