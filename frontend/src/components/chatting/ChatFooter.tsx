// ChatFooter.tsx

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
        {/* 이모티콘 버튼 */}
        <button type="button" className={styles.iconButton}>
          <img
            src={"/icon/face_smile.svg"} // 이모티콘 아이콘
            alt={"이모티콘 버튼"}
            className={styles.iconImage}
          />
        </button>

        <input
          type="text"
          id="chatInput"
          placeholder="메시지를 입력하세요..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSend((e.target as HTMLInputElement).value); // 여기서 sendMessage를 onSend로 수정
              (e.target as HTMLInputElement).value = ""; // 입력창 초기화
            }
          }}
        />

        {/* 멘션 버튼 */}
        <button type="button" className={styles.iconButton}>
          <img
            src={"/icon/at_sign.svg"} // 멘션 아이콘
            alt={"멘션 버튼"}
            className={styles.iconImage}
          />
        </button>

        <button
          type="submit"
          className={styles.iconButton}
          onClick={() =>
            onSend(
              (document.getElementById("chatInput") as HTMLInputElement).value
            )
          } // sendMessage를 onSend로 수정
        >
          <img
            src={"/icon/location_arrow.svg"} // 전송버튼
            alt={"전송버튼"}
            className={styles.profileImage}
          />
        </button>
      </form>
    </div>
  );
};

export default ChatFooter;
