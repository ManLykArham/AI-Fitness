import OpenAI from "openai";
import { TextContentBlock } from "openai/resources/beta/threads/messages";
import { saveChatMessages, getChatHistory } from "@/app/lib/chatStorage";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

if (!process.env.OPENAI_API_KEY || !process.env.OPENAI_ASSISTANT_ID) {
  console.error(
    "Missing necessary environment variables: OPENAI_API_KEY, OPENAI_ASSISTANT_ID"
  );
  process.exit(1);
}

const openaiassistant = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { userChatbotMessage, userHasSentMessage, threadID } =
      await request.json();

    // 🧠 1. Get the User ID from the token
    const cookie = cookies().get("token");
    const token = cookie ? cookie.value : null;

    if (!token) {
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    const userID = (decoded as any).userId;
    if (!userID) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    
    let assistantThreadID = threadID;
    if (!userHasSentMessage || !threadID) {
      const newThread = await openaiassistant.beta.threads.create();
      assistantThreadID = newThread.id;
    }

    
    await openaiassistant.beta.threads.messages.create(assistantThreadID, {
      role: "user",
      content: userChatbotMessage,
    });

    const run = await openaiassistant.beta.threads.runs.create(
      assistantThreadID,
      {
        assistant_id: process.env.OPENAI_ASSISTANT_ID!,
      }
    );

    let status = run.status;
    while (status !== "completed") {
      await new Promise((res) => setTimeout(res, 200));
      const check = await openaiassistant.beta.threads.runs.retrieve(
        assistantThreadID,
        run.id
      );
      status = check.status;
    }

    const assistantMessages =
      await openaiassistant.beta.threads.messages.list(assistantThreadID);
    const assistantMessage = assistantMessages.data[0]
      .content[0] as TextContentBlock;
    const chatbotResponse = assistantMessage.text.value;

    
    const previousData = await getChatHistory(userID);
    const previousMessages = previousData?.messages || [];

    const newMessages = [
      ...previousMessages,
      {
        id: `msg_${Date.now()}_user`,
        role: "user",
        content: userChatbotMessage,
      },
      { id: `msg_${Date.now()}_ai`, role: "ai", content: chatbotResponse },
    ];

    await saveChatMessages(userID, newMessages, assistantThreadID);

   
    return new Response(
      JSON.stringify({ chatbotResponse, assistantThreadID }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: any) {
    console.error("Chat error:", error);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
