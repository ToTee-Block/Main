"use client";

import { useEffect, useRef, useState } from "react";
import styles from "@/styles/components/chatting/ChatContainer.module.scss";
import ChatList from "./ChatList";
import ChatMessages from "./ChatMessages";
import ChatFooter from "./ChatFooter";
import ChatHeader from "./ChatHeader";
import ChatButton from "./ChatButton"; // ChatButton 컴포넌트 추가
import { Client } from "@stomp/stompjs";

interface Message {
  text: string;
  type: "sent" | "received";
  contentType: "image" | "text";
  senderId?: number;
  senderName?: string;
  senderProfile?: string;
  time: string;
  date: string;
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
  const [isWidgetOpen, setIsWidgetOpen] = useState(false); // 위젯 열림/닫힘 상태
  const [chatHistory, setChatHistory] = useState<ChatHistory>({});
  const [rooms, setRooms] = useState<RoomDetails[]>([]);
  const [roomDetails, setRoomDetails] = useState<RoomDetails | null>(null);
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const subscriptionRef = useRef<string | null>(null);
  const [notifications, setNotifications] = useState<{
    [roomId: string]: boolean;
  }>({});
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false); // 알림 상태

  // 현재 시간 가져오기
  const getCurrentTime = (): string =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  // 현재 날짜 가져오기
  const getCurrentDate = (): string => new Date().toISOString().split("T")[0];

  // 알림 상태 업데이트
  useEffect(() => {
    const hasUnread = Object.values(notifications).some((isUnread) => isUnread);
    setHasUnreadMessages(hasUnread);
  }, [notifications]);

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

  // 읽지 않은 메시지 상태 가져오기
  useEffect(() => {
    const fetchUnreadCounts = async () => {
      try {
        const res = await fetch("http://localhost:8081/chat/rooms/unread", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch unread counts");
        const data = await res.json();
        setNotifications(data);
      } catch (err) {
        console.error("Error fetching unread counts:", err);
      }
    };

    fetchUnreadCounts();
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

  // 방 세부 정보 및 메시지 가져오기
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
          contentType: message.contentType,
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

  // 방 선택
  const handleRoomSelect = async (roomId: string) => {
    setActiveRoom(roomId);

    try {
      await fetch(`http://localhost:8081/chat/${roomId}/read`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
      });
    } catch (err) {
      console.error("Error marking room as read:", err);
    }

    setNotifications((prev) => ({
      ...prev,
      [roomId]: false,
    }));

    if (subscriptionRef.current) {
      stompClient?.unsubscribe(subscriptionRef.current);
    }

    const subscription = stompClient?.subscribe(
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

        if (activeRoom !== String(roomId)) {
          setNotifications((prev) => ({
            ...prev,
            [roomId]: true,
          }));
        }
      }
    );

    subscriptionRef.current = subscription?.id || null;

    fetchRoomDetailsAndMessages(roomId);
  };

  // 메시지 전송
  const handleSendMessage = (message: string, imageUrl?: string) => {
    if (!stompClient || !activeRoom) return;

    const payload = {
      roomId: Number(activeRoom),
      message: imageUrl || message,
      contentType: imageUrl ? "image" : "text",
    };

    stompClient.publish({
      destination: "/pub/message",
      body: JSON.stringify(payload),
    });
  };

  // 채팅 위젯 열기/닫기 토글
  const handleChatWidgetToggle = () => {
    setIsWidgetOpen((prev) => !prev);
  };

  return (
    <div>
      {/* 알림 상태를 전달 */}
      <ChatButton
        onClick={handleChatWidgetToggle}
        hasUnread={hasUnreadMessages}
      />
      {isWidgetOpen && (
        <div className={styles.chatContainer}>
          <ChatList
            activeRoom={activeRoom}
            rooms={rooms}
            onRoomSelect={handleRoomSelect}
            notifications={notifications}
          />
          <div className={styles.chatContent}>
            {activeRoom ? (
              <>
                <ChatHeader roomDetails={roomDetails} />
                <ChatMessages
                  roomName={roomDetails?.name || ""}
                  messages={chatHistory[activeRoom] || []}
                />
                <ChatFooter
                  onSend={handleSendMessage}
                  activeRoom={activeRoom}
                />
              </>
            ) : (
              <p className={styles.noRoomSelected}>채팅방을 선택하세요</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatContainer;
