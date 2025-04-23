"use client";

import { Conversations } from "@/components/conversations";
import { InputForm } from "@/components/input-form";
import { openai } from "@/lib/server/openai";
import { useCallback, useState } from "react";
import { toast } from "sonner";

interface Conversation {
  message: string;
  isHuman: boolean;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function Home() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [aiMessage, setAiMessage] = useState("");
  const [userMessage, setUserMessage] = useState("");

  const onSubmit = useCallback(
    async () => {
      setConversations((prev) => [
        ...prev,
        { 
          message: userMessage, 
          isHuman: true 
        },
      ]);
      setUserMessage("");

      const conversationHistory: ChatMessage[] = conversations.map((con) => ({
        role: con.isHuman ? "user" : "assistant",
        content: con.message,
      }));

      conversationHistory.push({
        role: "user",
        content: userMessage,
      });

      const stream = await openai.chat.completions.create({
        model: "gpt-4.1-2025-04-14",
        messages: conversationHistory,
        stream: true,
      });

      let streamedMessage = "";
      try {
        for await (const part of stream) {
          const content = part.choices?.[0]?.delta?.content ?? "";
          const finishReason = part.choices?.[0]?.finish_reason;
  
          setAiMessage((prev) => prev + content);
          streamedMessage += content;

          if (finishReason === "stop") {
            setConversations((prev) => [
              ...prev,
              { 
                message: streamedMessage, 
                isHuman: false 
              },
            ]);
  
            setAiMessage("");
            break;
          }
        }
      } catch (err) {
        const message = typeof err === "object" && err !== null && "message" in err
          ? err.message
          : String(err);
        toast.error(`Stream iteration failed: ${message}`);
        return;
      }
    }, [userMessage, conversations]
  );

  return (
    <div className="flex flex-col w-full h-screen overflow-hidden">
      <Conversations conversations={conversations} aiMessage={aiMessage} />
      <InputForm
        userMessage={userMessage}
        setUserMessage={setUserMessage}
        handleSubmit={onSubmit}
      />
    </div>
  );
}
