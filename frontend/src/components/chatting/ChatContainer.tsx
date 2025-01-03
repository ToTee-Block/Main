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
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  // 드래그 시작
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (chatContainerRef.current) {
      const rect = chatContainerRef.current.getBoundingClientRect();
      setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      setIsDragging(true);
    }
  };

  // 드래그 이동
  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && chatContainerRef.current) {
      chatContainerRef.current.style.left = `${e.clientX - dragOffset.x}px`;
      chatContainerRef.current.style.top = `${e.clientY - dragOffset.y}px`;
    }
  };

  // 드래그 종료
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 이벤트 리스너 추가 및 제거
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

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
          senderId: message.senderId,
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
              senderId: data.senderId,
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

    subscriptionRef.current = subscription.id;

    fetchRoomDetailsAndMessages(roomId);
  };

  const handleSendMessage = (message: string, imageUrl?: string) => {
    if (!stompClient || !activeRoom) return;

    const payload = {
      roomId: Number(activeRoom),
      message: imageUrl || message, // imageUrl 또는 message 사용
      contentType: imageUrl ? "image" : "text",
    };

    stompClient.publish({
      destination: "/pub/message",
      body: JSON.stringify(payload),
    });
  };

  return (
    <div
      className={styles.chatContainer}
      ref={chatContainerRef}
      onMouseDown={handleMouseDown}
    >
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
