"use client";

import { useState } from "react";
import styles from "@/styles/components/chatting/ChatContainer.module.scss";
import ChatList from "./ChatList";
import ChatMessages from "./ChatMessages";
import ChatFooter from "./ChatFooter";
import ChatHeader from "./ChatHeader";

interface ChatMessage {
  text: string;
  type: "sent" | "received";
}

type ChatHistory = {
  [roomName: string]: ChatMessage[];
};

const ChatContainer = () => {
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatHistory>({
    박승수: [],
    관리자: [],
  });

  const handleSendMessage = (message: string) => {
    if (!activeRoom) return;

    setChatHistory((prev): ChatHistory => {
      // 현재 채팅방에 메시지 추가
      const updatedHistory: ChatMessage[] = [
        ...(prev[activeRoom] || []),
        { text: message, type: "sent" },
        { text: "메시지를 받았습니다.", type: "received" },
      ];

      return {
        ...prev,
        [activeRoom]: updatedHistory,
      };
    });
  };

  return (
    <div className={styles.chatContainer}>
      <ChatList
        activeRoom={activeRoom}
        rooms={Object.keys(chatHistory)}
        onRoomSelect={setActiveRoom}
      />
      <div className={styles.chatContent}>
        {activeRoom ? (
          <>
            <ChatHeader roomName={activeRoom} />
            <ChatMessages messages={chatHistory[activeRoom] || []} />
            <ChatFooter onSend={handleSendMessage} />
          </>
        ) : (
          <p className={styles.noRoomSelected}>채팅방을 선택하세요</p>
        )}
      </div>
    </div>
  );
};

export default ChatContainer;
