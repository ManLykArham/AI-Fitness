// /api/exercise/route.ts
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
  const { mealData } = await req.json();

  //const cookies = parseCookies(req as Request);
  //const token = cookies.token;
  console.log(token);
  const userID = token.value;
  console.log(userID);

  if (!token) {
    return new Response(JSON.stringify({ error: "Authentication required" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  // let userId;
  // try {
  //   const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
  //     userId: string;
  //   };
  //   userId = decoded.userId;
  // } catch (error) {
  //   return new Response(JSON.stringify({ error: "Invalid token" }), {
  //     status: 403,
  //     headers: { "Content-Type": "application/json" },
  //   });
  // }

  try {
    const client = await connectToDatabase();
    const db = client.db("aifitnessdb");
    const collection = db.collection("meals");

    const mealDoc = {
      userID,
      ...mealData,
      timestamp: new Date(),
    };

    const insertionResult = await collection.insertOne(mealDoc);

    // const exerciseID = await collection.find({ userID }).toArray();

    if (insertionResult.acknowledged) {
      return new Response(
        JSON.stringify({
          message: "Meal logged successfully",
          data: mealData,
          mealId: insertionResult.insertedId,
        }),
      );
    } else {
      throw new Error("Failed to insert meal");
    }
  } catch (error: any) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.toString() }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
