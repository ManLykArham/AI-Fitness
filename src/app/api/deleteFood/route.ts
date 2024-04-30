import { connectToDatabase } from "@/app/lib/dbConnection";
import { ObjectId } from "mongodb";

export async function POST(request: Request) {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  } // Parse the ID from the request body
  const data = await request.json();
  const id: any = data.id;
  console.log("[id]: " + id);

  if (!id) {
    return new Response(JSON.stringify({ error: "Missing exercise ID" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const client = await connectToDatabase();
    const db = client.db("aifitnessdb");
    const collection = db.collection("foods");

    // Delete the exercise using the parsed ID
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 1) {
      return new Response(
        JSON.stringify({ message: "Food deleted successfully" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      );
    } else {
      return new Response(JSON.stringify({ error: "Food not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
