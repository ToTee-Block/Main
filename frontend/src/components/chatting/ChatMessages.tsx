"use client";

import styles from "@/styles/components/chatting/ChatMessages.module.scss";

interface Message {
  text: string;
  type: "sent" | "received";
  senderName?: string;
  senderProfile?: string;
  time: string; // 메시지 전송 시간
  date: string; // 메시지 전송 날짜
}

interface ChatMessagesProps {
  messages: Message[];
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages }) => {
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
      {Object.keys(groupedMessages).map((date) => (
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
                    src={message.senderProfile || "/icon/circle_user.svg"}
                    alt={`${message.senderName || "익명"}의 프로필`}
                    className={styles.profileImage}
                  />
                  <span className={styles.senderName}>
                    {message.senderName || "익명"}
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
      ))}
    </div>
  );
};

export default ChatMessages;
