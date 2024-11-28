"use client";

import styles from "@/styles/components/chatting/ChatFooter.module.scss";

interface ChatFooterProps {
  onSend: (message: string) => void;
}

const ChatFooter: React.FC<ChatFooterProps> = ({ onSend }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input = document.getElementById("chatInput") as HTMLInputElement;
    const message = input.value.trim();
    if (message) {
      onSend(message); // 상위 컴포넌트로 메시지 전달
      input.value = "";
    }
  };

  return (
    <div className={styles.chatFooter}>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          id="chatInput"
          placeholder="메시지를 입력하세요..."
        />
        <button type="submit">전송</button>
      </form>
    </div>
  );
};

export default ChatFooter;
