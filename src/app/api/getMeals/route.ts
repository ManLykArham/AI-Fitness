import { connectToDatabase } from "@/app/lib/dbConnection";
import { cookies } from "next/headers";

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
    const collection = db.collection("meals");

    const meals = await collection.find({ userID }).toArray();

    const formattedMeals = meals.map((meal) => ({
      id: meal._id.toString(), // Convert ObjectId to string
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
