import { connectToDatabase } from "@/app/lib/dbConnection";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";

export async function POST(request: Request) {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const data = await request.json();
    if (data.calorieGoal === undefined) {
      return new Response(
        JSON.stringify({ error: "Calorie goal not provided" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Extracting the user ID from cookies
    const cookie: any = cookies().get("userID");
    const userID = cookie.value;

    if (!userID) {
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const client = await connectToDatabase();
    const db = client.db("aifitnessdb");
    const usersCollection = db.collection("users");

    // Updating the calorie goal for the authenticated user
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(userID) },
      { $set: { calorieGoal: data.calorieGoal } },
    );

    if (result.modifiedCount === 0) {
      return new Response(JSON.stringify({ error: "No changes made" }), {
        status: 304,
        headers: { "Content-Type": "application/json" },
      });
    }

    // If everything is successful, return the updated calorie goal
    return new Response(
      JSON.stringify({
        calorieGoal: data.calorieGoal,
        message: "Calorie goal updated successfully",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error: any) {
    console.error("Failed to set calorie goal", error);
    return new Response(
      JSON.stringify({ error: "Failed to update calorie goal" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
