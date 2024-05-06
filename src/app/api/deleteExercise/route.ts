import { connectToDatabase } from "@/app/lib/dbConnection";
import { ObjectId } from "mongodb";

export async function POST(request: Request): Promise<Response> {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Parse and validate the ID from the request body
  let data;
  try {
    data = await request.json();
  } catch (error) {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const id = data.id;
  if (!id) {
    return new Response(JSON.stringify({ error: "Missing exercise ID" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Validate that the ID is a valid MongoDB ObjectId
  if (!ObjectId.isValid(id)) {
    return new Response(JSON.stringify({ error: "Invalid exercise ID" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const client = await connectToDatabase();
    const db = client.db("aifitnessdb");
    const collection = db.collection("exercises");

    // Delete the exercise using the parsed and validated ID
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 1) {
      return new Response(JSON.stringify({ message: "Exercise deleted successfully" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      return new Response(JSON.stringify({ error: "Exercise not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error: any) {
    console.error("Failed to connect to the database or delete the document", error);
    return new Response(JSON.stringify({ error: "Internal server error", details: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
