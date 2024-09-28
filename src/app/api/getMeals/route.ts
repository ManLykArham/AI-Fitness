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
    const collection = db.collection("meals");

    const meals = await collection.find({ userID }).toArray();

    const formattedMeals = meals.map((meal) => ({
      id: meal._id.toString(), // Convert ObjectId to string
      mealType: meal.mealType,
      name: meal.name,
      calories: meal.calories,
      servingSizeG: meal.servingSizeG,
      fatTotalG: meal.fatTotalG,
      fatSaturatedG: meal.fatSaturatedG,
      proteinG: meal.proteinG,
      sodiumMg: meal.sodiumMg,
      potassiumMg: meal.potassiumMg,
      cholesterolMg: meal.cholesterolMg,
      carbohydratesTotalG: meal.carbohydratesTotalG,
      fiberG: meal.fiberG,
      sugarG: meal.sugarG,
      date: meal.date,
      showDetails: false,
    }));

    console.log("Formatted: " + formattedMeals);

    return new Response(JSON.stringify(formattedMeals), {
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
