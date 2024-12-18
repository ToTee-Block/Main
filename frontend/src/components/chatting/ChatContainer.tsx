import { useEffect, useRef, useState } from "react";
import styles from "@/styles/components/chatting/ChatContainer.module.scss";
import ChatList from "./ChatList";
import ChatMessages from "./ChatMessages";
import ChatFooter from "./ChatFooter";
import ChatHeader from "./ChatHeader";
import { Client } from "@stomp/stompjs";

interface Message {
  text: string; // 메시지 내용
  type: "sent" | "received"; // 보낸 메시지인지, 받은 메시지인지
  contentType: "image" | "text"; // 콘텐츠 타입: 이미지 또는 텍스트
  senderId?: number; // 발신자 ID
  senderName?: string; // 발신자 이름
  senderProfile?: string; // 발신자 프로필 이미지 URL
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
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          credentials: "include",
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

  // 현재 사용자 ID 가져오기
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const res = await fetch("http://localhost:8081/user/me", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          credentials: "include",
        });
        const userData = await res.json();
        setSenderId(userData.id);
      } catch (err) {
        console.error("Error fetching user ID:", err);
      }
    };

    fetchUserId();
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

      setChatHistory((prev) => ({
        ...prev,
        [roomId]: messages.map((message: any) => ({
          text: message.message,
          senderName: message.senderName,
          senderProfile: message.senderProfile,
          type: message.type,
          contentType: message.contentType, // 이미지 또는 텍스트
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
              senderName: data.senderName,
              senderProfile: data.senderProfile,
              type: data.type,
              contentType: data.contentType,
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

    // 새로운 구독 ID 저장
    subscriptionRef.current = subscription.id;

    fetchRoomDetailsAndMessages(roomId);
  };

  const handleSendMessage = (message: string, imageUrl?: string) => {
    if (!stompClient || !activeRoom || senderId === null) return;

    const payload = {
      roomId: Number(activeRoom),
      message: imageUrl || message,
      senderId,
      contentType: imageUrl ? "image" : "text",
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
              senderId={senderId}
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
