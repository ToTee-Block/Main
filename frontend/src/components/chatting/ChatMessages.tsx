import { useRef, useEffect } from "react";
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
  messages: Message[]; // 부모 컴포넌트에서 전달된 메시지
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ roomName, messages }) => {
  const messagesContainerRef = useRef<HTMLDivElement | null>(null); // 채팅 메시지 컨테이너 ref

  useEffect(() => {
    if (messagesContainerRef.current) {
      // 스크롤을 최하단으로 이동
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

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
    <div ref={messagesContainerRef} className={styles.chatMessages}>
      {Object.keys(groupedMessages).map((date) => (
        <div key={date}>
          {/* 날짜 헤더 */}
          <div className={styles.dateHeader}>{date}</div>
          {/* 해당 날짜의 메시지 리스트 */}
          {groupedMessages[date].map((message, index) => {
            const isSent = message.type === "sent";
            const messageClass = isSent ? styles.sent : styles.received;

            return (
              <div
                key={index}
                className={`${styles.chatMessage} ${messageClass}`}
              >
                {/* 수신 메시지의 프로필과 이름 */}
                {!isSent && (
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
                    <span className={styles.text}>{message.text}</span>
                  )}
                  <span className={styles.time}>{message.time}</span>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default ChatMessages;
