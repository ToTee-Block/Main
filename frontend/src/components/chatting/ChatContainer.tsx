import { useEffect, useRef, useState } from "react";
import styles from "@/styles/components/chatting/ChatContainer.module.scss";
import ChatList from "./ChatList";
import ChatMessages from "./ChatMessages";
import ChatFooter from "./ChatFooter";
import ChatHeader from "./ChatHeader";
import ChatButton from "./ChatButton";
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

interface Notification {
  roomId: string;
  unreadCount: number;
  senderEmail: string;
  message: string;
  type: string;
  timestamp: string;
}

const ChatContainer = () => {
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatHistory>({});
  const [rooms, setRooms] = useState<RoomDetails[]>([]);
  const [roomDetails, setRoomDetails] = useState<RoomDetails | null>(null);
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const subscriptionRef = useRef<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  // 드래그
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (chatContainerRef.current) {
      const rect = chatContainerRef.current.getBoundingClientRect();
      setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      setIsDragging(true);
    }
  };
  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && chatContainerRef.current) {
      chatContainerRef.current.style.left = `${e.clientX - dragOffset.x}px`;
      chatContainerRef.current.style.top = `${e.clientY - dragOffset.y}px`;
    }
  };
  const handleMouseUp = () => {
    setIsDragging(false);
  };
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

  useEffect(() => {
    const email = localStorage.getItem("userId");
    if (email) {
      setCurrentUserEmail(email);
    }
  }, []);

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

        client.subscribe("/sub/chatroom/notifications", (message) => {
          try {
            const incomingNotifications = JSON.parse(message.body); // 배열 가정
            setNotifications((prev) => {
              const updated = [...prev];

              incomingNotifications.forEach((newNotification: Notification) => {
                const existingIndex = updated.findIndex(
                  (n) => n.roomId === newNotification.roomId
                );

                if (existingIndex !== -1) {
                  // 기존 알림이 있을 경우 unreadCount 업데이트
                  updated[existingIndex].unreadCount += 1;
                } else {
                  // 새로운 알림 추가
                  updated.push({
                    ...newNotification,
                    unreadCount: 1,
                    senderEmail: newNotification.senderEmail, // senderEmail 추가
                    message: newNotification.message, // message 추가
                    type: newNotification.type, // type 추가
                    timestamp: newNotification.timestamp, // timestamp 추가
                  });
                }
              });

              return updated; // 업데이트된 배열 반환
            });

            console.log("Received notifications:", incomingNotifications);
          } catch (error) {
            console.error("Error parsing notification message:", error);
          }
        });
      };

      client.onStompError = (frame) => {
        console.error("STOMP error:", frame.headers["message"]);
      };

      client.activate();

      return () => client.deactivate(); // 클린업 함수
    };

    initializeClient();
  }, []);

  // useEffect(() => {
  //   const fetchNotifications = async () => {
  //     try {
  //       const res = await fetch("http://localhost:8081/chat/notifications", {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //         },
  //         credentials: "include",
  //       });
  //       if (!res.ok) throw new Error("Failed to fetch notifications");
  //       const data = await res.json();
  //       setNotifications(data);
  //     } catch (err) {
  //       console.error("Error fetching notifications:", err);
  //     }
  //   };

  //   fetchNotifications();
  // }, []);

  // 각 방의 알림 구독 (중복 제거)
  useEffect(() => {
    if (stompClient && rooms.length > 0) {
      const subscriptions = rooms.map((room) => {
        return stompClient.subscribe(
          `/sub/chatroom/notification/${room.id}`,
          (message) => {
            try {
              const notification = JSON.parse(message.body);
              setNotifications((prev) => {
                const updated = prev.map((n) => {
                  if (n.roomId === notification.roomId) {
                    return { ...n, unreadCount: notification.unreadCount };
                  }
                  return n;
                });

                // 새로운 방의 알림 추가
                if (!updated.find((n) => n.roomId === notification.roomId)) {
                  updated.push(notification);
                }

                return updated;
              });
              console.log("Received room notification:", notification);
            } catch (error) {
              console.error("Error parsing notification message:", error);
            }
          }
        );
      });

      return () => {
        subscriptions.forEach((sub) => sub.unsubscribe());
      };
    }
  }, [stompClient, rooms]);

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
          type: message.senderEmail === currentUserEmail ? "sent" : "received",
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

  const handleSendMessage = (message: string, imageUrl?: string) => {
    if (!stompClient || !activeRoom || !currentUserEmail) return;

    const payload = {
      roomId: Number(activeRoom),
      message: imageUrl || message,
      contentType: imageUrl ? "image" : "text",
      senderEmail: currentUserEmail,
    };

    stompClient.publish({
      destination: "/pub/message",
      body: JSON.stringify(payload),
    });
  };

  const handleRoomSelect = (roomId: string) => {
    if (!stompClient) return;

    setActiveRoom(roomId);

    setNotifications((prev) =>
      prev.map((n) => (n.roomId === roomId ? { ...n, unreadCount: 0 } : n))
    );

    if (subscriptionRef.current) {
      stompClient.unsubscribe(subscriptionRef.current);
    }

    const messageSubscription = stompClient.subscribe(
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
              type: data.senderEmail === currentUserEmail ? "sent" : "received",
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

    subscriptionRef.current = messageSubscription.id;

    fetchRoomDetailsAndMessages(roomId);
  };

  return (
    <>
      <ChatButton notifications={notifications} />
      <div
        className={styles.chatContainer}
        ref={chatContainerRef}
        onMouseDown={handleMouseDown}
      >
        <ChatList
          activeRoom={activeRoom}
          rooms={rooms}
          notifications={notifications}
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
    </>
  );
};

export default ChatContainer;
