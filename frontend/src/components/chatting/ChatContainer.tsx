import { useEffect, useState } from "react";
import styles from "@/styles/components/chatting/ChatContainer.module.scss";
import ChatList from "./ChatList";
import ChatMessages from "./ChatMessages";
import ChatFooter from "./ChatFooter";
import ChatHeader from "./ChatHeader";
import { Client } from "@stomp/stompjs";

interface ChatMessage {
  text: string;
  type: "sent" | "received";
  time: string;
  date: string;
}

type ChatHistory = {
  [roomId: string]: ChatMessage[];
};

interface RoomDetails {
  id: number;
  name: string;
  createdAt: string;
}

const ChatContainer = () => {
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatHistory>({});
  const [rooms, setRooms] = useState<{ id: number; name: string }[]>([]);
  const [roomDetails, setRoomDetails] = useState<RoomDetails | null>(null);
  const [stompClient, setStompClient] = useState<Client | null>(null);

  const getCurrentTime = (): string => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getCurrentDate = (): string => {
    const now = new Date();
    return now.toISOString().split("T")[0];
  };

  // 채팅방 목록 가져오기
  useEffect(() => {
    fetch("http://localhost:8081/chat/rooms")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch chat rooms.");
        return res.json();
      })
      .then((data) => setRooms(data))
      .catch((err) => console.error("Error fetching chat rooms:", err));
  }, []);

  // STOMP 클라이언트 초기화
  useEffect(() => {
    const client = new Client({
      brokerURL: "ws://localhost:8081/ws", // WebSocket URL (SockJS 제거)
      reconnectDelay: 5000, // 연결 재시도 간격
      debug: (str) => console.log(str),
    });

    client.onConnect = (frame) => {
      console.log(`Connected: ${frame}`);
      setStompClient(client);
    };

    client.onStompError = (frame) => {
      console.error("STOMP error:", frame.headers["message"]);
    };

    client.activate();

    return () => {
      client.deactivate();
    };
  }, []);

  // 채팅방 선택 및 구독
  const handleRoomSelect = (roomId: string) => {
    if (!stompClient) return;

    setActiveRoom(roomId);

    stompClient.subscribe(`/sub/chatroom/${roomId}`, (messageOutput) => {
      const data = JSON.parse(messageOutput.body);
      console.log("Received message:", data); // 메시지 수신 디버깅 로그
      if (data.type === "message") {
        setChatHistory((prev): ChatHistory => {
          const updatedHistory: ChatMessage[] = [
            ...(prev[roomId] || []),
            {
              text: data.message,
              type: data.sender === "Me" ? "sent" : "received", // 정확히 "sent" 또는 "received"로 지정
              time: new Date(data.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              date: new Date(data.timestamp).toISOString().split("T")[0],
            },
          ];
          return { ...prev, [roomId]: updatedHistory };
        });
      }
    });

    // 채팅방 세부 정보 가져오기
    fetch(`http://localhost:8081/chat/${roomId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch room details.");
        return res.json();
      })
      .then((data) => {
        setRoomDetails({
          id: data.id,
          name: data.name,
          createdAt: data.createdAt,
        });
      })
      .catch((err) => console.error("Error fetching room details:", err));
  };

  // 메시지 전송
  const handleSendMessage = (message: string) => {
    if (!stompClient || !activeRoom) return;

    const payload = {
      type: "message",
      roomId: activeRoom,
      message,
      sender: "Me",
      timestamp: new Date().toISOString(),
    };

    console.log("Sending message:", payload); // 메시지 송신 디버깅 로그

    stompClient.publish({
      destination: `/pub/message`, // 경로 수정
      body: JSON.stringify(payload),
    });

    setChatHistory((prev) => {
      const updatedHistory: ChatMessage[] = [
        ...(prev[activeRoom] || []),
        {
          text: message,
          type: "sent",
          time: getCurrentTime(),
          date: getCurrentDate(),
        },
      ];
      return { ...prev, [activeRoom]: updatedHistory };
    });
  };

  return (
    <div className={styles.chatContainer}>
      <ChatList
        activeRoom={activeRoom}
        rooms={rooms}
        onRoomSelect={handleRoomSelect}
      />
      <div className={styles.chatContent}>
        {activeRoom ? (
          <>
            <ChatHeader roomDetails={roomDetails} />
            <ChatMessages
              roomName={activeRoom}
              messages={chatHistory[activeRoom] || []}
            />
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
