import OpenAI from 'openai';
import { NextRequest } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // No NEXT_PUBLIC_ prefix! 
});

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const stream = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages,
      stream: true,
    });

    // Create a readable stream for the response
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const part of stream) {
            const content = part.choices?.[0]?.delta?.content ?? "";
            const finishReason = part.choices?.[0]?.finish_reason;

            controller.enqueue(
              encoder.encode(
                JSON.stringify({ content, finishReason }) + "\n"
              )
            );

            if (finishReason === "stop") {
              controller.close();
              break;
            }
          }
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Failed to process request" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}