import { MongoClient } from "mongodb";
import { connectToDatabase } from "@/app/lib/dbConnection";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import { Db } from "mongodb";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    console.log("Inside POST request in regitser/route.ts file");
    const data = await request.json();
    if (
      !data.email ||
      !data.password ||
      !data.name ||
      !data.surname ||
      !data.weight ||
      !data.height ||
      !data.goal
    ) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const dbClient: MongoClient = await connectToDatabase();
    const db: Db = dbClient.db("aifitnessdb"); // Get the default database
    const existingUser = await db
      .collection("users")
      .findOne({ email: data.email });
    if (existingUser) {
      return new Response(JSON.stringify({ error: "Email already exists" }), {
        status: 409,
        headers: { "Content-Type": "application/json" },
      });
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const newUser = {
      name: data.name,
      surname: data.surname,
      email: data.email,
      password: hashedPassword,
      weight: data.weight,
      height: data.height,
      goal: data.goal,
      calorieGoal: 0,
    };
    const result = await db.collection("users").insertOne(newUser);
    const userId = result.insertedId.toString();

     // Generate a JWT
     const secretKey = 'gqR8!f5#Pz'; // This should be stored securely and accessed via environment variables
     const token = jwt.sign({ userId }, secretKey, { expiresIn: '2h' });
 
     // Set the JWT in a httpOnly cookie
     cookies().set({
       name: "authToken",
       value: token,
       httpOnly: true,
       path: "/",
       secure: true, // set to true in production
       sameSite: 'strict',
     });
 
    // Send the response with the token and user ID
    return new Response(
      JSON.stringify({ message: "Signup successful", userId }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    return new Response(
      JSON.stringify({ error: "Registration failed", details: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
