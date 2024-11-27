"use client";

import ChatButton from "@/components/chatting/ChatButton";
import ChatContainer from "@/components/chatting/ChatContainer";
import { useState } from "react";

const ChatPage = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      <ChatButton onClick={() => setIsChatOpen((prev) => !prev)} />
      {isChatOpen && <ChatContainer />}
    </>
  );
};

export default ChatPage;
