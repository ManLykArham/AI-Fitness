import OpenAI from "openai";
import { TextContentBlock } from "openai/resources/beta/threads/messages";

//export const maxDuration = 200;
// Server-side imports and API endpoint

if (!process.env.OPENAI_API_KEY! || !process.env.OPENAI_ASSISTANT_ID!) {
  console.error("Missing necessary environment variables: OPENAI_API_KEY, OPENAI_ASSISTANT_ID");
  process.exit(1);
}

const openaiassistant = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(request: Request) {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  

  console.log("inside chat post function");

  const { userChatbotMessage, userHasSentMessage, threadID } = await request.json();
  let assistantThread;
  let assistantThreadID;
  if(userHasSentMessage === false){
    assistantThread = await openaiassistant.beta.threads.create();
    assistantThreadID = assistantThread.id;
  } else{
    assistantThreadID = threadID; 
  }
  console.log("awaited chatbot message");
  const OpenAIAssistantID = process.env.OPENAI_ASSISTANT_ID!;
  console.log("OpenAI_KEY: " + OpenAIAssistantID);
  console.log("retrieved openaiaissistant api");
  try {
    
    console.log("inside (try) catch block");
    //const assistantThread = await openaiassistant.beta.threads.create();
    console.log("created thread");
    console.log(assistantThreadID);
    console.log(userChatbotMessage);
    await openaiassistant.beta.threads.messages.create(assistantThreadID, {
      role: "user",
      content: userChatbotMessage,
    });
    console.log("Giving assistant role");
    const sendMessageRun = await openaiassistant.beta.threads.runs.create(
      assistantThreadID,
      {
        assistant_id: OpenAIAssistantID,
      },
    );

    let assistantRunStatus = sendMessageRun.status;
    console.log("Assigning and declaring assistantRunStatus");
    while (assistantRunStatus !== "completed") {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const loopRun = await openaiassistant.beta.threads.runs.retrieve(
        assistantThreadID,
        sendMessageRun.id,
      );
      assistantRunStatus = loopRun.status;
    }

    console.log("after while loop");

    const assistantMessages = await openaiassistant.beta.threads.messages.list(
      assistantThreadID,
    );
    console.log("AssistantMessages: " + assistantMessages);
    const assistantMessage = assistantMessages.data[0].content[0] as TextContentBlock;
    console.log("AssistantMessage: " + assistantMessage);
    const chatbotResponse = assistantMessage.text.value;
    console.log("Chatbot response: " + chatbotResponse);

    return new Response(JSON.stringify({ chatbotResponse, assistantThreadID }), {
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
