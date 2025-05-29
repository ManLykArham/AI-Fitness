import { NextRequest } from "next/server";
import { getChatHistory } from "@/app/lib/chatStorage";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  const token = cookies().get("token")?.value;
  if (!token) return new Response("Unauthorized", { status: 401 });

  const decoded = jwt.verify(token, process.env.JWT_SECRET!);
  const userID = (decoded as any).userId;

  const history = await getChatHistory(userID);
  console.log("Chat history fetched from DB:", history);

  if (!history) {
    return new Response(
      JSON.stringify({ messages: [], threadID: "", createdAt: null }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  return new Response(
    JSON.stringify({
      threadID: history.threadID || "",
      messages: history.messages || [],
      createdAt: history.createdAt || null,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
