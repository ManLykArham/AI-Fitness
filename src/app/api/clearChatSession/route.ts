import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { clearTodayChatSession } from "@/app/lib/chatStorage";

export async function POST(req: NextRequest) {
  const token = cookies().get("token")?.value;
  if (!token) return new Response("Unauthorized", { status: 401 });

  const decoded = jwt.verify(token, process.env.JWT_SECRET!);
  const userID = (decoded as any).userId;

  console.log("User ID inside clearChatSession:", userID);

  const cleared = await clearTodayChatSession(userID);

  return new Response(JSON.stringify({ success: cleared }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
