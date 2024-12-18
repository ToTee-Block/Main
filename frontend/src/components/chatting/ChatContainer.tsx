import { useEffect, useRef, useState } from "react";
import styles from "@/styles/components/chatting/ChatContainer.module.scss";
import ChatList from "./ChatList";
import ChatMessages from "./ChatMessages";
import ChatFooter from "./ChatFooter";
import ChatHeader from "./ChatHeader";
import { Client } from "@stomp/stompjs";

interface Message {
  text: string;
  type: "sent" | "received"; // 메시지 타입
  senderId?: number; // 발신자 ID
  senderName?: string; // 발신자 이름
  senderProfile?: string; // 발신자 프로필 (옵션)
  time: string; // 메시지 전송 시간
  date: string; // 메시지 전송 날짜
}

type ChatHistory = {
  [roomId: string]: Message[];
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

  // 채팅방 세부 정보와 과거 메시지 가져오기
  const fetchRoomDetailsAndMessages = async (roomId: string) => {
    try {
      // 채팅방 세부 정보 가져오기
      const roomRes = await fetch(`http://localhost:8081/chat/${roomId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
      });

      if (!roomRes.ok) throw new Error("Failed to fetch room details");
      const roomData = await roomRes.json();
      setRoomDetails(roomData);

      // 과거 메시지 가져오기
      const messageRes = await fetch(
        `http://localhost:8081/chat/${roomId}/messages`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          credentials: "include",
        }
      );

      if (!messageRes.ok) throw new Error("Failed to fetch messages");
      const messages = await messageRes.json();

      // 메시지 데이터를 chatHistory에 추가
      setChatHistory((prev) => ({
        ...prev,
        [roomId]: messages.map((message: any) => ({
          text: message.message,
          senderId: message.senderId,
          senderName: message.senderName,
          senderProfile: message.senderProfile, // senderProfile 추가
          type: message.type,
          time: new Date(message.sendTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          date: new Date(message.sendTime).toISOString().split("T")[0],
        })),
      }));
    } catch (err) {
      console.error("Error fetching room details and messages:", err);
    }
  };

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
              senderId: data.senderId,
              senderName: data.senderName,
              senderProfile: data.senderProfile, // senderProfile 추가
              type: data.type,
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

    // 채팅방 세부 정보와 과거 메시지 가져오기
    fetchRoomDetailsAndMessages(roomId);
  };

  const handleSendMessage = (message: string) => {
    if (!stompClient || !activeRoom) return;

    const payload = {
      roomId: Number(activeRoom),
      message,
    };

    stompClient.publish({
      destination: "/pub/message",
      body: JSON.stringify(payload),
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
