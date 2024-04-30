import OpenAI from "openai";
import { TextContentBlock } from "openai/resources/beta/threads/messages.mjs";
import { Chat } from "openai/resources/index.mjs";
import { threadId } from "worker_threads";
export const maxDuration = 200;

const openaiassistant = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  const { userChatbotMessage } = await request.json();

  const OpenAIAssistantID = process.env.OPENAI_ASSISTANT_ID!;

  try {
    let assistantRunStatus = "pending";

    const ChatAssistant =
      await openaiassistant.beta.assistants.retrieve(OpenAIAssistantID);

    const assistantThread = await openaiassistant.beta.threads.create();
    await openaiassistant.beta.threads.messages.create(assistantThread.id, {
      role: "user",
      content: userChatbotMessage,
    });

    const sendMessageRun = await openaiassistant.beta.threads.runs.create(
      assistantThread.id,
      {
        assistant_id: ChatAssistant.id,
        // instructions: "",
      },
    );

    while (assistantRunStatus !== "completed") {
      const loopRun = await openaiassistant.beta.threads.runs.retrieve(
        assistantThread.id,
        sendMessageRun.id,
      );
      assistantRunStatus = loopRun.status;
      console.log("The run status is currently:" + assistantRunStatus);

      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    const assistantMessages = await openaiassistant.beta.threads.messages.list(
      assistantThread.id,
    );

    const assistantMessage = (await assistantMessages.data[0]
      .content[0]) as TextContentBlock;
    const chatbotResponse = assistantMessage.text.value;

    return new Response(JSON.stringify({ chatbotResponse: chatbotResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
