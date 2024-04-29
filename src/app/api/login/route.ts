// Import necessary libraries
import { MongoClient } from "mongodb";
import { connectToDatabase } from "@/app/lib/dbConnection";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import { Db } from "mongodb";
import { cookies } from 'next/headers'

//Reuse the MongoDB connection setup
// let dbClient: any = null;
// async function connectToDatabase() {
//   if (!dbClient) {
//     const client = new MongoClient(process.env.DATABASE_URI!);
//     await client.connect();
//     dbClient = client.db("aifitnessdb"); // Specify your actual database name
//   }
//   return dbClient;
// }

export async function POST(request: Request) {
  if (request.method !== 'POST') {
    return new Response(
        JSON.stringify({ error: "Method Not Allowed" }),
        {
          status: 405,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  try {
    const data = await request.json();
    if (!data.email || !data.password) {
      return new Response(
        JSON.stringify({ error: "Email and password are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const dbClient: MongoClient = await connectToDatabase();
    const db: Db = dbClient.db("aifitnessdb"); // Get the default database
    const user = await db.collection("users").findOne({ email: data.email });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      return new Response(JSON.stringify({ error: "Invalid password" }), {
        status: 401, // Unauthorized
        headers: { "Content-Type": "application/json" },
      });
    }

    const userId = user._id.toString(); // Converting MongoDB ObjectId to string
    const token = jwt.sign({ userId }, process.env.JWT_SECRET!, {
      expiresIn: "2h",
    });

    cookies().set({
      name: 'userID',
      value: userId,
      httpOnly: true,
      path: '/',
    })

    // const cookie = serialize("token", token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV !== "development",
    //   sameSite: "strict",
    //   path: "/",
    //   maxAge: 7200, // 2 hours
    // });

    // console.log(cookie);

    return new Response(
      JSON.stringify({ message: "Login successful", userId }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error: any) {
    console.error("Login error:", error);
    return new Response(
      JSON.stringify({ error: "Login failed", details: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
