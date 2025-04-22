"use client";

import { useEffect, useRef } from "react";
import { ChatBubble } from "./chat-bubble";

interface ConversationsProps {
  conversations: { message: string; isHuman: boolean }[];
  aiMessage: string;
}

export const Conversations = ({
  conversations,
  aiMessage
}: ConversationsProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversations, aiMessage]);

  return (
    <div className="w-full h-[90%] flex flex-col justify-end mt-0 m-auto bg-primary/90">
      <div className="max-h-[800px] overflow-y-auto p-[30px]">
        {conversations && conversations.map((conversation, index) => {
          return (
            <ChatBubble 
              key={index}
              isHuman={conversation.isHuman}
              message={conversation.message}
            />
          );
        })}
        {aiMessage && <ChatBubble  isHuman={false} message={aiMessage} />}

        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}