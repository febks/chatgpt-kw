"use client";

import { Conversations } from "@/components/conversations";
import { InputForm } from "@/components/input-form";
import { useCallback, useState } from "react";
import { toast } from "sonner";

interface Conversation {
  message: string;
  isHuman: boolean;
}

interface ChatMessage {
  role:  "user" | "assistant";
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
        role: con.isHuman ?  "user" : "assistant",
        content: con.message,
      }));

      conversationHistory.push({
        role: "user",
        content: userMessage,
      });

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers:  {
            "Content-Type":  "application/json",
          },
          body: JSON.stringify({ messages: conversationHistory }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch");
        }

        const reader = response.body?. getReader();
        const decoder = new TextDecoder();
        let streamedMessage = "";

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder. decode(value);
            const lines = chunk.split("\n").filter(line => line.trim());

            for (const line of lines) {
              try {
                const { content, finishReason } = JSON.parse(line);
                
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
                }
              } catch (error) {
                console.error("Failed to parse line:", line);
                console.error(error);
              }
            }
          }
        }
      } catch (err) {
        const message = typeof err === "object" && err !== null && "message" in err
          ? err.message
          : String(err);
        toast.error(`Request failed: ${message}`);
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