// pages/api/initializeChat.ts
import OpenAI from "openai";
import { TextContentBlock } from "openai/resources/beta/threads/messages.mjs";
import { cookies } from "next/headers";

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
      
      let data;
      try {
        data = await request.json();
      } catch (error) {
        return new Response(JSON.stringify({ error: "Bad Request: Invalid JSON" }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }
    
      
    const { userChatbotMessage, userDetails, userHasSentMessagePer, threadIDPer } = data
    // const userDetails =  { name: "John", surname: "Doe", weight: "70", height: "175", goal: "lose", calorieGoal: 2000 };
    if (!userDetails || !userDetails.name) {
      console.error("User details are missing or incomplete", userDetails);
      return new Response(JSON.stringify({ error: "User details are missing or incomplete" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    let assistantThread;
  let assistantThreadID;
  if(userHasSentMessagePer === false){
    assistantThread = await openaiassistant.beta.threads.create();
    assistantThreadID = assistantThread.id;
  } else{
    assistantThreadID = threadIDPer; 
  }
  const OpenAIAssistantID = process.env.OPENAI_ASSISTANT_ID!;
  
  try {
    // Create a personalized prompt using user details
    let prompt = `Here's a user with specific needs:\n` +
                 `Name: ${userDetails.name}, Surname: ${userDetails.surname}, Weight: ${userDetails.weight}, ` +
                 `Height: ${userDetails.height}, Goal: ${userDetails.goal}, Calorie Goal: ${userDetails.calorieGoal}. ` +
                 `Past week's meals and exercises have also been considered.\n\n` +
                 `${userChatbotMessage}`;

    let prompt2 = `Here's a user with specific needs:\nName: ${userDetails.name}, Surname: ${userDetails.surname}, Weight: ${userDetails.weight}, Height: ${userDetails.height}, Goal: ${userDetails.goal}, Calorie Goal: ${userDetails.calorieGoal}. \nRecent activities include: ${userDetails.exerciseSummary}. \nRecent meals include: ${userDetails.mealSummary}.\n\n${userChatbotMessage}`;

    let prompt3 = `Here's a user with specific needs:\nName: ${userDetails.name}, Surname: ${userDetails.surname}, Weight: ${userDetails.weight}, Height: ${userDetails.height}, Goal: ${userDetails.goal}, Calorie Goal: ${userDetails.calorieGoal}. \nRecent activities include: ${userDetails.exerciseSummary}. \nRecent meals include: ${userDetails.mealSummary}.`;

    console.log("created thread");
    console.log(assistantThreadID);
    console.log(userChatbotMessage);
    await openaiassistant.beta.threads.messages.create(assistantThreadID, {
      role: "assistant",
      content: prompt2,
    });

    await openaiassistant.beta.threads.messages.create(assistantThreadID, {
        role: "user",
        content: userChatbotMessage,
      });

    const sendMessageRun = await openaiassistant.beta.threads.runs.create(assistantThreadID, {
      assistant_id: OpenAIAssistantID,
    });

    let assistantRunStatus = sendMessageRun.status;
    while (assistantRunStatus !== "completed") {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const loopRun = await openaiassistant.beta.threads.runs.retrieve(
        assistantThreadID,
        sendMessageRun.id,
      );
      assistantRunStatus = loopRun.status;
    }

    const assistantMessages = await openaiassistant.beta.threads.messages.list(
      assistantThreadID,
    );

    const assistantMessage = assistantMessages.data[0].content[0] as TextContentBlock;
    const assistantThreadIDPer = assistantThreadID;

    return new Response(JSON.stringify({ chatbotResponse: assistantMessage.text.value, assistantThreadIDPer }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error:any) {
    console.error("Failed to initialize chat:", error);
    return new Response(JSON.stringify({ error: error.toString() }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
