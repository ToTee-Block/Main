import { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import styles from "@/styles/components/chatting/ChatList.module.scss"; // 스타일 임포트 예시

interface ChatMessage {
  senderName: string;
  message: string;
  time: string;
}

const ChatApp = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [client, setClient] = useState<Client | null>(null);

  // WebSocket 연결 및 메시지 송수신 설정
  useEffect(() => {
    const stompClient = new Client({
      brokerURL: "ws://localhost:8080/ws", // 서버의 WebSocket 엔드포인트
      connectHeaders: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // JWT 토큰 추가 (선택 사항)
      },
      debug: (str) => {
        console.log(str); // 디버깅용
      },
      onConnect: () => {
        console.log("WebSocket 연결됨!");
        // 메시지 수신 처리
        stompClient.subscribe("/sub/chatroom/1", (message) => {
          const chatMessage = JSON.parse(message.body);
          setMessages((prevMessages) => [...prevMessages, chatMessage]);
        });
      },
      onDisconnect: () => {
        console.log("WebSocket 연결 종료됨");
      },
    });

    stompClient.activate();
    setClient(stompClient);

    // 컴포넌트 언마운트 시 연결 종료
    return () => {
      stompClient.deactivate();
    };
  }, []);

  // 메시지 전송 함수
  const sendMessage = (message: string) => {
    if (client) {
      const chatMessage = {
        message,
      };
      client.publish({
        destination: "/pub/message", // 서버에서 받을 메시지 엔드포인트
        body: JSON.stringify(chatMessage), // 메시지 내용
      });
    }
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatMessages}>
        {messages.map((msg, index) => (
          <div key={index} className={styles.chatMessage}>
            <strong>{msg.senderName}: </strong>
            <span>{msg.message}</span>
            <div>{msg.time}</div>
          </div>
        ))}
      </div>

      <div className={styles.chatFooter}>
        <input
          type="text"
          id="chatInput"
          placeholder="메시지를 입력하세요..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage((e.target as HTMLInputElement).value);
              (e.target as HTMLInputElement).value = ""; // 입력창 초기화
            }
          }}
        />
        <button
          onClick={() =>
            sendMessage(
              (document.getElementById("chatInput") as HTMLInputElement).value
            )
          }
        >
          전송
        </button>
      </div>
    </div>
  );
};

export default ChatApp;
