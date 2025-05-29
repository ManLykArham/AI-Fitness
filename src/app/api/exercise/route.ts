// /api/exercise/route.ts
import { connectToDatabase } from "@/app/lib/dbConnection";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }
  const { activity, duration } = await req.json();
  // Extract the token from the cookies
  const cookie = cookies().get("token");
  const token = cookie ? cookie.value : null;

  if (!token) {
    return new Response(JSON.stringify({ error: "Authentication required" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
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
      }
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
      }
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
      date: new Date().toISOString(),
    };

    const insertionResult = await collection.insertOne(exerciseDoc);

    // const exerciseID = await collection.find({ userID }).toArray();

    if (insertionResult.acknowledged) {
      return new Response(
        JSON.stringify({
          message: "Exercise logged successfully",
          data: data,
          exerciseId: insertionResult.insertedId,
        })
      );
    } else {
      throw new Error("Failed to insert exercise");
    }
  } catch (error: any) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.toString() }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
