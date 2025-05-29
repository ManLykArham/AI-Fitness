import { connectToDatabase } from "@/app/lib/dbConnection";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export const dynamic = "force-dynamic";

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
        }
      );
    }

    // Verify and decode the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    const userID = (decoded as any).userId;

    if (!userID) {
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const client = await connectToDatabase();
    const db = client.db("aifitnessdb");
    const collection = db.collection("exercises");

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const exercises = await collection
      .find({
        userID: userID,
        date: {
          $gte: today.toISOString(),
          $lt: tomorrow.toISOString(),
        },
      })
      .toArray();

    const recentExercise = exercises
      .map((exercise) => ({
        activity: exercise.activity,
        duration: exercise.duration,
        calories: exercise.caloriesBurned,
        timeLogged: exercise.date,
      }))
      .sort((a, b) => b.timeLogged.localeCompare(a.timeLogged));

    const totalCalories = recentExercise.reduce(
      (acc, exercise) => acc + exercise.calories,
      0
    );

    return new Response(JSON.stringify({ recentExercise, totalCalories }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Failed to retrieve exercise", error);
    return new Response(JSON.stringify({ error: "Failed to retrieve data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
