import { connectToDatabase } from "@/app/lib/dbConnection";
import { cookies } from "next/headers";
import { MongoClient, ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export const dynamic = "force-dynamic";

type Data = {
  message?: string;
  error?: string;
};

export async function POST(request: Request) {
  if (request.method !== "POST") {
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
        }
      );
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

    const data = await request.json();

    if (!data.oldPassword || !data.newPassword) {
      return new Response(
        JSON.stringify({ error: "Missing fields are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const client = await connectToDatabase();
    const db = client.db("aifitnessdb");
    const collection = db.collection("users");

    const user = await collection.findOne({ _id: new ObjectId(userID) });
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const match = await bcrypt.compare(data.oldPassword, user.password);
    if (!match) {
      return new Response(
        JSON.stringify({ error: "Old password is incorrect" }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(data.newPassword, salt);

    await db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(userID) },
        { $set: { password: hashedPassword } }
      );

    return new Response(
      JSON.stringify({ message: "Password updated successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Failed to reset password", error);
    return new Response(JSON.stringify({ error: "Failed to reset password" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
