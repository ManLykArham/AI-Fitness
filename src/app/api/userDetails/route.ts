// pages/api/userDetails.ts
import { connectToDatabase } from "@/app/lib/dbConnection";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (req.method !== "GET") {
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
        }
      );
    }

    // Verify and decode the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    const userID = (decoded as any).userId;

    if (!userID) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const client = await connectToDatabase();
    const db = client.db("aifitnessdb");
    const foodsCollection = db.collection("foods");
    const exercisesCollection = db.collection("exercises");
    const usersCollection = db.collection("users");

    // Calculate date 7 days ago
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Convert sevenDaysAgo to ISO string to match MongoDB stored date format
    const dateQuery = { $gte: sevenDaysAgo.toISOString() };

    // Fetch only recent meals and exercises within the last 7 days
    const meals = await foodsCollection
      .find({
        userID: userID,
        date: dateQuery,
      })
      .toArray();
    const exercises = await exercisesCollection
      .find({
        userID: userID,
        date: dateQuery,
      })
      .toArray();
    const user = await usersCollection.findOne({ _id: new ObjectId(userID) });
    console.log(exercises);
    console.log(meals);

    return new Response(
      JSON.stringify({
        message: "Data obtained",
        data: { user, exercises, meals },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.toString() }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
