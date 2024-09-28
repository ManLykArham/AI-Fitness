import { connectToDatabase } from "@/app/lib/dbConnection";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  if (request.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
   // Extract the token from the cookies
   const cookie = cookies().get("token");
   const token = cookie ? cookie.value : null;

   if (!token) {
     return new Response(
       JSON.stringify({ error: "Authentication required" }),
       {
         status: 401,
         headers: { "Content-Type": "application/json" },
       },
     );
   }

   // Verify and decode the JWT token
   const decoded = jwt.verify(token, process.env.JWT_SECRET!);
   const userID = (decoded as any).userId;

   if (!userID) {
     return new Response(
       JSON.stringify({ error: "Invalid token" }),
       {
         status: 401,
         headers: { "Content-Type": "application/json" },
       },
     );
   }

    const client = await connectToDatabase();
    const db = client.db("aifitnessdb");
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(userID) });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const calorieGoal = user.calorieGoal || 0; // Return 0 if not set
    console.log("got calorie goals");
    return new Response(JSON.stringify({ calorieGoal }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Failed to retrieve calorie goal", error);
    return new Response(JSON.stringify({ error: "Failed to retrieve data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
