import { useEffect, useRef, useState } from "react";
import styles from "@/styles/components/chatting/ChatContainer.module.scss";
import ChatList from "./ChatList";
import ChatMessages from "./ChatMessages";
import ChatFooter from "./ChatFooter";
import ChatHeader from "./ChatHeader";
import { Client } from "@stomp/stompjs";

interface ChatMessage {
  text: string;
  type: "sent" | "received";
  senderName?: string;
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
  const [rooms, setRooms] = useState<RoomDetails[]>([]);
  const [roomDetails, setRoomDetails] = useState<RoomDetails | null>(null);
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const subscriptionRef = useRef<string | null>(null);
  const [senderId, setSenderId] = useState<number | null>(null);

  // 현재 시간/날짜 가져오기
  const getCurrentTime = (): string =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const getCurrentDate = (): string => new Date().toISOString().split("T")[0];

  // 채팅방 목록 가져오기
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch("http://localhost:8081/chat/rooms", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // 토큰 추가
          },
          credentials: "include", // 쿠키를 사용하는 경우
        });
        if (!res.ok) throw new Error("Failed to fetch chat rooms");
        const data = await res.json();
        setRooms(data);
      } catch (err) {
        console.error("Error fetching chat rooms:", err);
      }
    };

    fetchRooms();
  }, []);

  // STOMP 클라이언트 초기화
  useEffect(() => {
    const initializeClient = () => {
      const client = new Client({
        brokerURL: "ws://localhost:8081/ws",
        reconnectDelay: 5000,
        debug: (str) => console.log(str),
      });

      client.onConnect = () => {
        console.log("Connected to WebSocket");
        setStompClient(client);
      };

      client.onStompError = (frame) => {
        console.error("STOMP error:", frame.headers["message"]);
      };

      client.activate();

      return () => client.deactivate();
    };

    initializeClient();
  }, []);

  const handleRoomSelect = (roomId: string) => {
    if (!stompClient) return;

    setActiveRoom(roomId);

    // 기존 구독 해제
    if (subscriptionRef.current) {
      stompClient.unsubscribe(subscriptionRef.current);
    }

    // 새로운 방 구독
    const subscription = stompClient.subscribe(
      `/sub/chatroom/${roomId}`,
      (messageOutput) => {
        const data = JSON.parse(messageOutput.body);

        setChatHistory((prev) => ({
          ...prev,
          [roomId]: [
            ...(prev[roomId] || []),
            {
              text: data.message,
              senderId: data.senderId, // ChatDTO의 `senderId`
              type: data.senderId === 1 ? "sent" : "received", // 사용자 ID에 따라 메시지 타입 구분
              time: new Date(data.sendTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              date: new Date(data.sendTime).toISOString().split("T")[0],
            },
          ],
        }));
      }
    );

    subscriptionRef.current = subscription.id;

    // 채팅방 세부 정보 가져오기
    const fetchRoomDetails = async () => {
      try {
        const res = await fetch(`http://localhost:8081/chat/${roomId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch room details");
        const data = await res.json();
        setRoomDetails(data);
      } catch (err) {
        console.error("Error fetching room details:", err);
      }
    };

    fetchRoomDetails();
  };

  const handleSendMessage = (message: string) => {
    if (!stompClient || !activeRoom) return;

    const payload = {
      roomId: Number(activeRoom), // `ChatDTO`의 `roomId`는 Long 타입
      message,
    };

    stompClient.publish({
      destination: "/pub/message",
      body: JSON.stringify(payload),
    });

    // 내 메시지는 즉시 화면에 추가
    setChatHistory((prev) => ({
      ...prev,
      [activeRoom]: [
        ...(prev[activeRoom] || []),
        {
          text: message,
          type: "sent",
          time: getCurrentTime(),
          date: getCurrentDate(),
        },
      ],
    }));
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
              roomName={roomDetails?.name || ""}
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
