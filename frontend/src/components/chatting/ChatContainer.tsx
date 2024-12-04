"use client";

import { useState, useEffect } from "react";
import styles from "@/styles/components/chatting/ChatContainer.module.scss";
import ChatList from "./ChatList";
import ChatMessages from "./ChatMessages";
import ChatFooter from "./ChatFooter";
import ChatHeader from "./ChatHeader";

interface ChatMessage {
  text: string;
  type: "sent" | "received";
  time: string;
  date: string;
}

type ChatHistory = {
  [roomId: string]: ChatMessage[]; // roomId를 키로 사용
};

const ChatContainer = () => {
  const [activeRoom, setActiveRoom] = useState<string | null>(null); // activeRoom은 roomId로 저장
  const [chatHistory, setChatHistory] = useState<ChatHistory>({});
  const [isLoading, setIsLoading] = useState(false);

  const getCurrentTime = (): string => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getCurrentDate = (): string => {
    const now = new Date();
    return now.toISOString().split("T")[0]; // YYYY-MM-DD
  };

  // 채팅방 목록을 백엔드에서 가져오기
  const [rooms, setRooms] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    setIsLoading(true);
    fetch("http://localhost:8081/chat/rooms")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch chat rooms.");
        return res.json();
      })
      .then((data) => {
        setRooms(data); // 채팅방 목록 설정
      })
      .catch((err) => console.error("Error fetching chat rooms:", err))
      .finally(() => setIsLoading(false));
  }, []);

  // 백엔드에서 특정 채팅방의 채팅 기록을 불러오기
  useEffect(() => {
    if (activeRoom) {
      setIsLoading(true);
      fetch(`http://localhost:8081/chat/${activeRoom}/messages`) // activeRoom은 roomId
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch chat messages.");
          return res.json();
        })
        .then((data) => {
          const fetchedMessages: ChatMessage[] = data.map((msg: any) => ({
            text: msg.message,
            type: msg.senderName === "Me" ? "sent" : "received",
            time: new Date(msg.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            date: new Date(msg.timestamp).toISOString().split("T")[0],
          }));

          setChatHistory((prev) => ({
            ...prev,
            [activeRoom]: fetchedMessages,
          }));
        })
        .catch((err) => console.error("Error fetching chat messages:", err))
        .finally(() => setIsLoading(false));
    }
  }, [activeRoom]);

  // 메시지 전송 후 백엔드에 저장
  const handleSendMessage = (message: string) => {
    if (!activeRoom) return;

    const currentTime = getCurrentTime();
    const currentDate = getCurrentDate();

    const newMessage: ChatMessage = {
      text: message,
      type: "sent",
      time: currentTime,
      date: currentDate,
    };

    setChatHistory((prev): ChatHistory => {
      const updatedHistory: ChatMessage[] = [
        ...(prev[activeRoom] || []),
        newMessage,
      ];

      return {
        ...prev,
        [activeRoom]: updatedHistory,
      };
    });

    // 백엔드로 메시지 전송
    fetch("http://localhost:8081/pub/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roomId: activeRoom, // roomId를 사용
        senderName: "Me",
        message, // 클라이언트에서 보낸 메시지
      }),
    }).catch((err) => console.error("Error sending message:", err));
  };

  return (
    <div className={styles.chatContainer}>
      <ChatList
        activeRoom={activeRoom}
        rooms={rooms} // rooms는 이제 id와 name이 포함된 객체 배열로 전달됨
        onRoomSelect={(roomId) => setActiveRoom(String(roomId))} // roomId를 activeRoom으로 설정
      />
      <div className={styles.chatContent}>
        {activeRoom ? (
          <>
            <ChatHeader
              roomName={
                rooms.find((room) => room.id === Number(activeRoom))?.name || ""
              }
            />
            {isLoading ? (
              <p>Loading messages...</p>
            ) : (
              <ChatMessages
                initialMessages={chatHistory[activeRoom] || []}
                roomName={activeRoom}
              />
            )}
            <ChatFooter onSend={handleSendMessage} activeRoom={activeRoom} />
          </>
        ) : (
          <p className={styles.noRoomSelected}>채팅방을 선택하세요</p>
        )}
      </div>
    </div>
  );
};

export default ChatContainer;
