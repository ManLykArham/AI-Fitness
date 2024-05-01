import OpenAI from "openai";
import { TextContentBlock } from "openai/resources/beta/threads/messages.mjs";
import { Chat } from "openai/resources/index.mjs";
import { threadId } from "worker_threads";
//export const maxDuration = 200;
// Server-side imports and API endpoint

const openaiassistant = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(request: Request) {
  console.log("inside chat post function");
  const { userChatbotMessage } = await request.json();
  console.log("awaited chatbot message");
  const OpenAIAssistantID = process.env.OPENAI_ASSISTANT_ID!;
  console.log("OpenAI_KEY: " + OpenAIAssistantID );
  console.log("retrieved openaiaissistant api");
  try {
    console.log("inside (try) catch block");
    const assistantThread = await openaiassistant.beta.threads.create();
    console.log("created thread");
    console.log(assistantThread.id);
    console.log(userChatbotMessage);
    await openaiassistant.beta.threads.messages.create(assistantThread.id, {
      role: "user",
      content: userChatbotMessage,
    });
    console.log("Giving assistant role");
    const sendMessageRun = await openaiassistant.beta.threads.runs.create(assistantThread.id, {
      assistant_id: OpenAIAssistantID,
    });

    let assistantRunStatus = sendMessageRun.status;
    console.log("Assigning and declaring assistantRunStatus");
    while (assistantRunStatus !== "completed") {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const loopRun = await openaiassistant.beta.threads.runs.retrieve(
        assistantThread.id,
        sendMessageRun.id,
      );
      assistantRunStatus = loopRun.status;
    }

    console.log("after while loop");

    const assistantMessages = await openaiassistant.beta.threads.messages.list(assistantThread.id);
    console.log("AssistantMessages: " + assistantMessages);
    const assistantMessage = assistantMessages.data[0].content[0] as TextContentBlock;
    console.log("AssistantMessage: " + assistantMessage);
    const chatbotResponse = assistantMessage.text.value;
    console.log("Chatbot response: " + chatbotResponse);


    return new Response(JSON.stringify({ chatbotResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}