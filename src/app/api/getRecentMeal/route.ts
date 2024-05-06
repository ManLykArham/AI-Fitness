// pages/api/getRecentMeals.ts
import { connectToDatabase } from "@/app/lib/dbConnection";
import { ObjectId } from "mongodb";
import { cookies } from "next/headers"; // If using outside of Next.js, this will differ
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  if (request.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // Extract user ID from cookies; method depends on server setup
    const cookie: any = cookies().get("userID"); // Adjust according to actual cookie parsing method
    const userID = cookie ? cookie.value : null;

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
    const collection = db.collection("foods");

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Ensure your MongoDB stores the date as a Date object
    const foods = await collection
      .find({
        userID: userID, // Directly use string if your userID in DB is a string
        date: {
          $gte: today.toISOString(),
          $lt: tomorrow.toISOString(),
        },
      })
      .toArray();

    const recentMeals = foods
      .map((food) => ({
        mealType: food.mealType,
        name: food.name,
        calories: food.calories,
        timeLogged:
          food.date instanceof Date
            ? food.date.toISOString()
            : new Date(food.date).toISOString(),
      }))
      .sort((a, b) => b.timeLogged.localeCompare(a.timeLogged));

    const totalCalories = recentMeals.reduce(
      (acc, meal) => acc + meal.calories,
      0,
    );
    console.log("recent meals: " + recentMeals);
    console.log("total cal: " + totalCalories);
    return new Response(JSON.stringify({ recentMeals, totalCalories }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Failed to retrieve food", error);
    return new Response(JSON.stringify({ error: "Failed to retrieve data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
