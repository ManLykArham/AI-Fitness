// pages/api/userDetails.ts
import { connectToDatabase } from '@/app/lib/dbConnection';
import { cookies } from "next/headers";
import { ObjectId } from 'mongodb';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    if (req.method !== "GET") {
      return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json" },
      });
    }

    try {
        const token: any = cookies().get("userID");
        if (!token) {
            return new Response(JSON.stringify({ error: "Authentication required" }), {
              status: 401,
              headers: { "Content-Type": "application/json" },
            });
        }
        const userID = token.value;

        const client = await connectToDatabase();
        const db = client.db("aifitnessdb");
        const foodsCollection = db.collection("foods");
        const exercisesCollection = db.collection("exercises");
        const usersCollection = db.collection("users");

        // Calculate date 7 days ago
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        // Convert sevenDaysAgo to ISO string to match MongoDB stored date format
        const dateQuery = { $gte: sevenDaysAgo.toISOString() };

        // Fetch only recent meals and exercises within the last 7 days
        const meals = await foodsCollection.find({
            userID: userID,
            date: dateQuery
        }).toArray();
        const exercises = await exercisesCollection.find({
            userID: userID,
            date: dateQuery
        }).toArray();
        const user = await usersCollection.findOne({ _id: new ObjectId(userID) });
console.log(exercises)
console.log(meals)

        return new Response(JSON.stringify({
            message: "Data obtained",
            data: { user, exercises, meals }
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.toString() }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
    }
}
