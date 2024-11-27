"use client";

import styles from "@/styles/components/chatting/ChatMessages.module.scss";

interface Message {
  text: string;
  type: "sent" | "received";
}

interface ChatMessagesProps {
  messages: Message[];
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages }) => {
  return (
    <div className={styles.chatMessages}>
      {messages.map((message, index) => (
        <div
          key={index}
          className={`${styles.chatMessage} ${styles[message.type]}`}
        >
          <div className={styles.message}>{message.text}</div>
        </div>
      ))}
    </div>
  );
};

export default ChatMessages;
