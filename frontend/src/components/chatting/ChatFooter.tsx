import { useState } from "react";
import styles from "@/styles/components/chatting/ChatFooter.module.scss";

interface ChatFooterProps {
  onSend: (message: string, imageUrl?: string) => void;
  activeRoom: string | null;
}

const ChatFooter: React.FC<ChatFooterProps> = ({ onSend, activeRoom }) => {
  const [message, setMessage] = useState<string>(""); // 메시지 입력 상태
  const [image, setImage] = useState<File | null>(null); // 선택된 이미지 상태
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false); // 이모티콘 선택창 상태

  // 이모티콘 추가 함수
  const addEmoji = (emoji: string) => {
    setMessage((prev) => prev + emoji); // 기존 입력 메시지에 이모티콘 추가
    setShowEmojiPicker(false); // 이모티콘 선택창 닫기
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!activeRoom) return;

    let imageUrl = "";

    // 이미지 파일 업로드
    if (image) {
      const formData = new FormData();
      formData.append("image", image);

      try {
        const res = await fetch(
          `http://localhost:8081/chat/${activeRoom}/upload`,
          {
            method: "POST",
            body: formData,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            credentials: "include",
          }
        );

        if (!res.ok) throw new Error("Failed to upload image");

        const result = await res.json();
        console.log("서버 반환 이미지 URL:", result.imageUrl);
        imageUrl = result.imageUrl; // 서버에서 반환된 이미지 URL
      } catch (err) {
        console.error("Image upload error:", err);
        return;
      }
    }

    // 메시지 또는 이미지 전송
    onSend(message, imageUrl);
    setMessage("");
    setImage(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <div className={styles.chatFooter}>
      <form onSubmit={handleSubmit}>
        {/* 이모티콘 버튼 */}
        <button
          type="button"
          className={styles.iconButton}
          onClick={() => setShowEmojiPicker((prev) => !prev)}
        >
          <img
            src={"/icon/face_smile.svg"} // 이모티콘 아이콘
            alt={"이모티콘 버튼"}
            className={styles.iconImage}
          />
        </button>
  
        {/* 이모티콘 선택창 */}
        {showEmojiPicker && (
          <div className={styles.emojiPicker}>
            <span onClick={() => addEmoji("😊")}>😊</span>
            <span onClick={() => addEmoji("😂")}>😂</span>
            <span onClick={() => addEmoji("😍")}>😍</span>
            <span onClick={() => addEmoji("👍")}>👍</span>
            <span onClick={() => addEmoji("🥰")}>🥰</span>
          </div>
        )}
  
        {/* 파일 선택 버튼 */}
        <label className={styles.iconButton}>
          <img
            src={"/icon/at_sign.svg"} // 파일 첨부 아이콘
            alt={"파일 첨부 버튼"}
            className={styles.iconImage}
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className={styles.fileInput}
          />
        </label>
  
        {/* 이미지 썸네일 또는 이름 표시 */}
        {image && (
          <div className={styles.filePreview}>
            <img
              src={URL.createObjectURL(image)}
              alt="선택된 이미지"
              className={styles.thumbnail}
            />
          </div>
        )}
  
        {/* 메시지 입력창 */}
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="메시지를 입력하세요..."
          className={styles.input}
        />
  
        {/* 전송 버튼 */}
        <button type="submit" className={styles.iconButton}>
          <img
            src={"/icon/location_arrow.svg"} // 전송 아이콘
            alt={"전송 버튼"}
            className={styles.iconImage}
          />
        </button>
      </form>
    </div>
  );
  
};

export default ChatFooter;
