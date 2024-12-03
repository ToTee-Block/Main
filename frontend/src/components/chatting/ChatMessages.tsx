"use client";

import { useEffect, useState } from "react";
import styles from "@/styles/components/chatting/ChatMessages.module.scss";

// 메시지 타입 정의
interface Message {
  text: string;
  type: "sent" | "received";
  senderName?: string; // 발신자 이름 (옵션)
  senderProfile?: string; // 발신자 프로필 이미지 URL (옵션)
  time: string; // 메시지 전송 시간
  date: string; // 메시지 전송 날짜
}

interface ChatMessagesProps {
  roomName: string; // 채팅방 이름
  initialMessages: Message[]; // 초기 메시지 (Optional, 부모 컴포넌트에서 전달)
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  roomName,
  initialMessages,
}) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages); // 초기 메시지를 상태로 설정
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 관리

  // 백엔드에서 메시지 가져오기
  useEffect(() => {
    setIsLoading(true);
    fetch(`http://localhost:8081/chat/${roomName}/messages`) // 해당 채팅방의 메시지 가져오기
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch messages.");
        return res.json();
      })
      .then((data) => {
        const formattedMessages: Message[] = data.map((msg: any) => ({
          text: msg.text,
          type: msg.sender === "Me" ? "sent" : "received", // 발신자 구분
          senderName: msg.senderName || "익명", // 이름이 없다면 "익명"
          senderProfile: msg.senderProfile || "/icon/circle_user.svg", // 프로필이 없다면 기본 이미지
          time: new Date(msg.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          date: new Date(msg.timestamp).toISOString().split("T")[0], // 날짜 포맷
        }));

        // 받은 메시지 상태 업데이트
        setMessages(formattedMessages);
      })
      .catch((err) => console.error("Error fetching messages:", err))
      .finally(() => setIsLoading(false)); // 로딩 상태 false로 설정
  }, [roomName]); // roomName이 변경될 때마다 메시지 재로딩

  // 날짜별로 메시지 그룹화
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
      {isLoading ? (
        <p>Loading messages...</p> // 로딩 중일 때 메시지 표시
      ) : (
        Object.keys(groupedMessages).map((date) => (
          <div key={date}>
            {/* 날짜 헤더 */}
            <div className={styles.dateHeader}>{date}</div>
            {/* 해당 날짜의 메시지 리스트 */}
            {groupedMessages[date].map((message, index) => (
              <div
                key={index}
                className={`${styles.chatMessage} ${styles[message.type]}`}
              >
                {/* 수신 메시지의 프로필과 이름 */}
                {message.type === "received" && (
                  <div className={styles.senderInfo}>
                    <img
                      src={message.senderProfile}
                      alt={`${message.senderName}의 프로필`}
                      className={styles.profileImage}
                    />
                    <span className={styles.senderName}>
                      {message.senderName}
                    </span>
                  </div>
                )}
                {/* 메시지 내용 */}
                <div className={styles.message}>
                  {message.text}
                  <span className={styles.time}>{message.time}</span>
                </div>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default ChatMessages;
