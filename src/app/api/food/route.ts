// pages/api/exercise/route.ts
import { connectToDatabase } from "@/app/lib/dbConnection";
import { parseCookies } from "@/app/utils/parseCookies";
import jwt from "jsonwebtoken";
import { NextApiRequest } from "next";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const token: any = cookies().get("userID");
  const { name, mealName, mealType } = await req.json();
  console.log(req.body);
  console.log("In the API init:" + name);

  //const cookies = parseCookies(req as Request);
  //const token = cookies.token;
  console.log(token);
  const userID = token.value;
  console.log(userID);

// Authentication required error
if (!token) {
  return new Response(JSON.stringify({ error: "Authentication required" }), {
    status: 401,
    headers: { "Content-Type": "application/json" },
  });
}

  // Bad request error for missing data
  if (!name || !mealName || !mealType) {
    return new Response(JSON.stringify({ error: "Bad Request - Missing fields" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  try {
    const apiResponse = await fetch(
      `https://api.api-ninjas.com/v1/nutrition?query=` + name,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": "uqvXuwvG+dMRJNNvCK/eDw==MSB3hIFeNEbBSWx3",
        },
      },
    );

    if (!apiResponse.ok) {
      throw new Error(`API responded with status ${apiResponse.status}`);
    }

    const data = await apiResponse.json();

    const client = await connectToDatabase();
    const db = client.db("aifitnessdb");
    const collection = db.collection("foods");

    let totalCal = 0;
    let totalServ = 0;
    let totalFat = 0;
    let totalFatSat = 0;
    let totalProtein = 0;
    let totalSodium = 0;
    let totalPotassium = 0;
    let totalCholesterol = 0;
    let totalCarbohydrates = 0;
    let totalFiber = 0;
    let totalSugar = 0;

    for (let i = 0; i < data.length; i++) {
      const food = data[i];
      totalCal += food.calories;
      totalServ += food.serving_size_g;
      totalFat += food.fat_total_g;
      totalFatSat += food.fat_saturated_g;
      totalProtein += food.protein_g;
      totalSodium += food.sodium_mg;
      totalPotassium += food.potassium_mg;
      totalCholesterol += food.cholesterol_mg;
      totalCarbohydrates += food.carbohydrates_total_g;
      totalFiber += food.fiber_g;
      totalSugar += food.sugar_g;
    }

    
    const foodData = {
      userID,
      mealName,
      mealType,
      name,
      calories: parseFloat(totalCal.toFixed(2)), // Round calories to 2 decimal places
      serving: parseFloat(totalServ.toFixed(2)), // Round serving size to 2 decimal places
      fat: parseFloat(totalFat.toFixed(2)), // Round total fat to 2 decimal places
      fatSat: parseFloat(totalFatSat.toFixed(2)), // Round saturated fat to 2 decimal places
      protein: parseFloat(totalProtein.toFixed(2)), // Round protein to 2 decimal places
      sodium: parseFloat(totalSodium.toFixed(2)), // Round sodium to 2 decimal places
      potassium: parseFloat(totalPotassium.toFixed(2)), // Round potassium to 2 decimal places
      cholesterol: parseFloat(totalCholesterol.toFixed(2)), // Round cholesterol to 2 decimal places
      carbohydrates: parseFloat(totalCarbohydrates.toFixed(2)), // Round total carbohydrates to 2 decimal places
      fiber: parseFloat(totalFiber.toFixed(2)), // Round fiber to 2 decimal places
      sugar: parseFloat(totalSugar.toFixed(2)), // Round sugar to 2 decimal places
      timestamp: new Date(),
      date: new Date().toISOString(),
    };
    
    
    const insertionResult = await collection.insertOne(foodData);

    if (insertionResult.acknowledged) {
      return new Response(JSON.stringify({
        message: "Food logged successfully",
        data: foodData,
        foodId: insertionResult.insertedId,
      }), {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      });
    } else {
      throw new Error("Failed to insert food data");
    }
  } catch (error: any) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.toString() }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
