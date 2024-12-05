import { useEffect, useState } from "react";
import styles from "@/styles/components/chatting/ChatContainer.module.scss";
import ChatList from "./ChatList";
import ChatMessages from "./ChatMessages";
import ChatFooter from "./ChatFooter";
import ChatHeader from "./ChatHeader";
import SockJS from "sockjs-client";
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

  // 채팅방 선택 및 웹소켓 연결
  const handleRoomSelect = (roomId: string) => {
    setActiveRoom(roomId);

    // 채팅방에 대해 웹소켓 연결
    const socket = new SockJS("http://localhost:8081/ws");
    const client = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log(str),
      onConnect: (frame) => {
        console.log(`Connected: ${frame}`);

        // 채팅방 입장 요청
        client.publish({
          destination: `/app/chat/${roomId}`,
          body: JSON.stringify({ type: "join", roomId }),
        });

        // 채팅방 메시지 구독
        client.subscribe(`/topic/chatroom/${roomId}`, (messageOutput) => {
          const data = JSON.parse(messageOutput.body);
          if (data.type === "message") {
            setChatHistory((prev) => {
              const updatedHistory = [
                ...(prev[data.roomId] || []),
                {
                  text: data.message,
                  type: data.sender === "Me" ? "sent" : "received",
                  time: new Date(data.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                  date: new Date(data.timestamp).toISOString().split("T")[0],
                },
              ];
              return { ...prev, [data.roomId]: updatedHistory };
            });
          }
        });

        setStompClient(client);
      },
      onStompError: (frame) => {
        console.error("STOMP error:", frame);
      },
    });

    // 활성화하여 WebSocket 연결
    client.activate();

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

    stompClient.publish({
      destination: `/app/chat/${activeRoom}`,
      body: JSON.stringify(payload),
    });

    setChatHistory((prev) => {
      const updatedHistory: ChatMessage[] = [
        ...(prev[activeRoom] || []),
        {
          text: message,
          type: "sent", // "sent" | "received" 중 하나로 명시
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
