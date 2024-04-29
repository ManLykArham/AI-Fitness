// /api/exercise/route.ts
import { connectToDatabase } from "@/app/lib/dbConnection";
import { parseCookies } from "@/app/utils/parseCookies";
import jwt from "jsonwebtoken";
import { NextApiRequest } from "next";
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  if (req.method !== 'POST') {
    return new Response(
        JSON.stringify({ error: "Method Not Allowed" }),
        {
          status: 405,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  const token:any = cookies().get("userID")
  const { activity, duration } = await req.json();
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

  if (!activity || !duration) {
    return new Response(
      JSON.stringify({ error: "Activity and duration are required" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  try {
    const apiResponse = await fetch(
      `https://api.api-ninjas.com/v1/caloriesburned?activity=${activity}&duration=${duration}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": process.env.APININJA_API_KEY!,
        },
      },
    );

    if (!apiResponse.ok) {
      throw new Error(`API responded with status ${apiResponse.status}`);
    }

    const data = await apiResponse.json();

    const client = await connectToDatabase();
    const db = client.db("aifitnessdb");
    const collection = db.collection("exercises");

    const exerciseDoc = {
      userID,
      activity,
      duration,
      caloriesBurned: data[0].total_calories,
      timestamp: new Date(),
    };

    await collection.insertOne(exerciseDoc);

    return new Response(
      JSON.stringify({ message: "Exercise logged successfully", data }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error: any) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.toString() }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
