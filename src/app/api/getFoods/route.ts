import { connectToDatabase } from "@/app/lib/dbConnection";
import { cookies } from "next/headers";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (request.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // const cookies = request.cookies;
    // const userID = cookies.userID; // Assuming the cookie contains the userID directly
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
    const collection = db.collection("foods");

    const foods = await collection.find({ userID }).toArray();

    const formattedFoods = foods.map((food) => ({
      _id: food._id.toString(),
      userID: food.userID,
      mealType: food.mealType,
      mealName: food.mealName,
      timestamp: food.timestamp.toISOString(),
      date: food.date,
      name: food.name,
      calories: food.calories,
      serving_size_g: food.serving,
      fat_total_g: food.fat,
      fat_saturated_g: food.fatSat,
      protein_g: food.protein,
      sodium_mg: food.sodium,
      potassium_mg: food.potassium,
      cholesterol_mg: food.cholesterol,
      carbohydrates_total_g: food.carbohydrates,
      fiber_g: food.fiber,
      sugar_g: food.sugar,
    }));

    console.log("Formatted: " + formattedFoods);

    return new Response(JSON.stringify(formattedFoods), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Failed to retrieve exercises", error);
    return new Response(JSON.stringify({ error: "Failed to retrieve data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
