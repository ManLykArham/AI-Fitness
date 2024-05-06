import { MongoClient } from "mongodb";
import { connectToDatabase } from "@/app/lib/dbConnection";
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import { Db } from "mongodb";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }
  try {
    const data = await request.json();
    console.log(data.email);
    if (
      !data.email ||
      !data.name ||
      !data.surname ||
      !data.weight ||
      !data.height ||
      !data.goal
    ) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const cookie: any = cookies().get("userID");
    const userID = cookie.value;

    const dbClient: MongoClient = await connectToDatabase();
    const db: Db = dbClient.db("aifitnessdb");

    // Check if user exists
    const existingUser = await db
      .collection("users")
      .findOne({ _id: new ObjectId(userID) });
    if (!existingUser) {
      return new Response(JSON.stringify({ error: "User not found." }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log(existingUser);

    // Update user information, avoiding password rehash unless it's new or changed
    const updateData: any = {
      name: data.name,
      surname: data.surname,
      email: data.email,
      weight: data.weight,
      height: data.height,
      goal: data.goal,
    };

    const result = await db
      .collection("users")
      .updateOne({ _id: new ObjectId(userID) }, { $set: updateData });

    if (result.modifiedCount === 0) {
      return new Response(JSON.stringify({ error: "No changes were made." }), {
        status: 304,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Optionally, create/update a JWT token
    // const token = jwt.sign({ userId: userID }, process.env.JWT_SECRET!, {
    //   expiresIn: "2h",
    // });

    return new Response(JSON.stringify({ message: "Update successful" }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error: any) {
    console.error("Error updating user details:", error);
    return new Response(
      JSON.stringify({ error: "Update failed", details: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
